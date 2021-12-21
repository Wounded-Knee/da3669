import { WebSocket } from 'uWebSockets.js';
import { NodeSelector, selectNodes } from './NodeSelector';
import { PromiseId, SessionId, UserId } from '../../../shared/all';
import { v4 as uuidv4 } from 'uuid';
import { server, client } from '../../../shared/lib/redux/actionTypes';
import { getNetWorthByUserId } from './getNetWorthByUserId';
import { Model, Types, ObjectId } from 'mongoose';
import { defaultModel, getModelByName } from '../nodes/all';
import { INodeAll } from '../../../shared/nodes/all';
import { INodeSelectorCfg } from '../../../shared/lib/NodeSelector';

const { ObjectId } = Types;

const debug = {
  orders: true,
  [server.SUBSCRIBE]: false,
  [server.UNSUBSCRIBE]: false,
  [server.SUBSCRIBE_BY_SELECTOR]: false,
};

interface ISocket {
  sessionId?: SessionId;
  socket: WebSocket;
  dates: {
    create: Date;
  };
}
interface IOrder {
  sessionId: SessionId;
  promiseId: PromiseId;
  type: string;
  payload: any;
  dates?: {
    create: Date;
    fulfilled?: Date;
  };
}
interface ISubscription {
  userId: UserId;
  selector: INodeSelectorCfg;
  dates: {
    create: Date;
  };
}
interface ISession {
  userId: UserId;
  sessionId: SessionId;
  dates: {
    create: Date;
  };
}
interface IUser {
  name: string;
  pictureUrl: string;
  googleId: string;
}
interface IUserProfileGoogle {
  id: string;
  displayName: string;
  photos?: { value: string }[];
}
type UserProfile = IUserProfileGoogle;

const UserModel = getModelByName('User');
const EconomyModel = getModelByName('Economy');
const DefaultModel = defaultModel;
class Users {
  sessions = <ISession[]>[];
  sockets = <ISocket[]>[];
  orders = <IOrder[]>[];
  subscriptions = <ISubscription[]>[];

  async orderProcess(order: IOrder) {
    if (!order.dates.fulfilled) {
      const { type, payload, sessionId } = order;
      if (debug.orders && debug[server[type]] !== false) console.log('Processing ', order);
      const session = this.sessionFetchById(sessionId);
      if (session) {
        const { userId } = session;
        switch (type) {
          case server.GET_USER:
            this.orderFulfill(order, {
              type: client.STASH,
              payload: await UserModel.findById(userId),
            });
            break;
        }
        if (userId) {
          switch (type) {
            case server.ECONOMY_TRANSFER:
              const { qty, destinationId } = payload;
              new EconomyModel({
                qty,
                destinationId,
                author: userId,
              })
                .save()
                .then(async (transaction) => {
                  this.orderFulfill(order, {
                    type: client.UPDATE_NET_WORTH,
                    payload: await getNetWorthByUserId(userId),
                  });
                });
              break;

            case server.CREATE:
              Promise.all(
                payload.map(
                  (nodeData): INodeAll =>
                    new DefaultModel({
                      ...nodeData,
                      rel: Object.keys(nodeData.rel).reduce((rel, relName) => {
                        return { ...rel, [relName]: nodeData.rel[relName].map((_id) => new ObjectId(_id)) };
                      }, {}),
                      author: userId,
                    }).save(),
                ),
                //@ts-ignore
              ).then((mongooseObjects: Model): void => {
                this.orderFulfill(order, {
                  type: client.STASH,
                  payload: this.broadcast(this.modelsToNodes(mongooseObjects)),
                });
              });
              break;

            case server.SUBSCRIBE:
              const thisNodeSelector = <NodeSelector>selectNodes().deserialize(payload);
              console.log('Subscribe ', payload, thisNodeSelector);
              this.subscribe(thisNodeSelector, userId);
              this.orderFulfill(order, {
                type: client.STASH,
                payload: await thisNodeSelector.getNodes(),
              });
              break;
          }
        } else {
          // No userId
        }
      } else {
        // No Session
      }
    }
  }

  orderAdd(order: IOrder) {
    const thisOrder = {
      ...order,
      dates: {
        create: new Date(),
      },
    };
    this.orders.push(thisOrder);
    this.orderProcess(thisOrder);
  }

  orderFulfill(order: IOrder, action) {
    const { sessionId, promiseId } = order;
    const sockets = this.socketsGetBySessionId(sessionId);
    sockets.forEach(({ socket }) => {
      socket.send(
        JSON.stringify({
          promiseId,
          action,
        }),
      );
    });
    this.orders = this.orders.map((thisOrder) => {
      return thisOrder === order
        ? {
            ...order,
            dates: {
              ...order.dates,
              fulfilled: new Date(),
            },
          }
        : order;
    });
  }

  async broadcast(nodes: INodeAll[]): Promise<INodeAll[]> {
    let broadcastCount = 0;
    let socketCount = 0;
    this.subscriptions.forEach(async ({ selector: selectorCfg, userId }) => {
      const candidateNodes = this.stringifyNodeIds(nodes);
      const matchingNodes = await selectNodes(selectorCfg).filterMatchingNodes(candidateNodes);
      if (matchingNodes.length) {
        broadcastCount++;
        const { sessionId } = this.sessionFetchByUserId(userId);
        const sockets = this.socketsGetBySessionId(sessionId);
        sockets.forEach(({ socket }) => {
          socketCount++;
          socket.send(
            JSON.stringify({
              action: {
                type: client.STASH,
                payload: matchingNodes,
              },
            }),
          );
        });
      }
    });
    console.log(`Broadcast ${broadcastCount} nodes to ${socketCount} sockets.`);
    return nodes;
  }

  sessionFetchByUserId(userId: UserId): ISession {
    return this.sessions.find(({ userId: thisUserId }) => thisUserId === userId);
  }

  sessionFetchById(sessionId: SessionId): ISession {
    return this.sessions.find(({ sessionId: thisSessionId }) => thisSessionId === sessionId);
  }

  sessionCreate(userId: UserId): ISession {
    const session = <ISession>{
      userId,
      sessionId: uuidv4(),
      dates: {
        create: new Date(),
      },
    };
    this.sessions.push(session);
    return session;
  }

  async userCreateOrFetchByProfile(userProfile: UserProfile): Promise<IUser> {
    // We should update profile data here, too.
    const foundUser = await this.userFetchByProfile(userProfile);
    if (typeof foundUser === 'object' && foundUser !== null) {
      console.log('Found user ', foundUser);
      return foundUser;
    }
    console.log('Creating user');
    const {
      displayName: name,
      photos: [{ value: pictureUrl }],
      id: googleId,
    } = userProfile;
    return await this.userCreate({
      name,
      pictureUrl,
      googleId,
    });
  }

  // Creates a new user
  async userCreate(user: IUser): Promise<IUser> {
    return await new UserModel(user).save();
  }

  // Retrieves a user by Google OAuth2.0 ID
  async userFetchByProfile(userProfile: UserProfile): Promise<IUser | boolean> {
    const query = { $and: [{ googleId: userProfile.id }, { googleId: { $ne: '' } }] };
    const foundUser = await UserModel.findOne(query).exec();
    return foundUser;
  }

  // Retrieves a user by ID
  async userFetchById(userId: UserId): Promise<IUser | boolean> {
    const foundUser = await UserModel.findById(userId);
    return foundUser;
  }

  // Identifies a websocket with a user
  socketUse(ws: WebSocket, sessionId: SessionId) {
    this.sockets = this.sockets.map((socket) => {
      return socket.socket === ws
        ? {
            ...socket,
            sessionId,
          }
        : socket;
    });
  }

  // Cleans up after a closed socket
  socketDismiss(ws: WebSocket) {
    this.sockets = this.sockets.filter(({ socket }) => socket !== ws);
  }

  // Registers a newly-opened socket
  socketWelcome(ws: WebSocket) {
    this.sockets.push({
      socket: ws,
      dates: {
        create: new Date(),
      },
    });
  }

  // Returns the record of information concerning the socket
  socketQuery(ws: WebSocket) {
    return this.sockets.find(({ socket }) => socket === ws);
  }

  socketsGetBySessionId(sessionId: SessionId): ISocket[] {
    return this.sockets.filter(({ sessionId: thisSessionId }) => thisSessionId === sessionId);
  }

  // Subscribes given user to the given selector
  subscribe(selector: NodeSelector, userId: UserId) {
    this.subscriptions.push({
      userId,
      selector: selector.serialize(),
      dates: {
        create: new Date(),
      },
    });
  }

  // Unsubscribes the given user from the given selector
  unSubscribe(selector: NodeSelector, userId: UserId) {
    this.subscriptions.filter(
      (subscription) =>
        subscription.userId !== userId || !selectNodes().deserialize(subscription.selector).equals(selector),
    );
  }

  stringifyNodeIds(nodeArray: INodeAll[]): INodeAll[] {
    return nodeArray.map((node) => ({
      ...node,
      _id: node._id.toString(),
    }));
  }

  // @ts-ignore
  modelsToNodes(modelArray: Model[]): INodeAll[] {
    return modelArray.map((mongooseObject): INodeAll => mongooseObject.toObject());
  }
}

export const UserManager = new Users();
