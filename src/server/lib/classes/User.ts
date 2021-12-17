import { WebSocket } from 'uWebSockets.js';
import { NodeSelector } from './NodeSelector';
import { PromiseId, SessionId, UserId } from '../../../shared/all';
import { getNodeTypeByName } from '../../../shared/nodes/all';
import { v4 as uuidv4 } from 'uuid';
import { server, client } from '../../../shared/lib/redux/actionTypes';

const debug = {
  orders: true,
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
  };
}
interface IFulfillment {
  promiseId: PromiseId;
  action: {
    type: string;
    payload: any;
  };
}
interface ISubscription {
  userId: UserId;
  selector: NodeSelector;
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
  photos: { value: string }[];
}
type UserProfile = IUserProfileGoogle;

const UserModel = getNodeTypeByName('User').model;
class Users {
  sessions = <ISession[]>[];
  sockets = <ISocket[]>[];
  orders = <IOrder[]>[];
  subscriptions = <ISubscription[]>[];

  orderProcess() {
    this.orders.forEach(async (order: IOrder) => {
      if (debug.orders) console.log('Processing ', order);

      const { type, sessionId } = order;
      const session = this.sessionFetchById(sessionId);
      if (session) {
        const { userId } = session;
        switch (type) {
          case server.GET_USER:
            this.orderFulfill(order, {
              type: client.ABSORB_NODES,
              payload: await UserModel.findById(userId),
            });
            break;
        }
      } else {
        // No Session
      }
    });
  }

  orderAdd(order: IOrder) {
    this.orders.push({
      ...order,
      dates: {
        create: new Date(),
      },
    });
    this.orderProcess();
  }

  orderFulfill(order: IOrder, action) {
    const { sessionId, promiseId } = order;
    const { socket } = this.socketGetBySessionId(sessionId);
    socket.send(
      JSON.stringify({
        promiseId,
        action,
      }),
    );
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
    const foundUser = await this.userFetchByProfile(userProfile);
    if (typeof foundUser === 'object') return foundUser;

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
    return await new UserModel(user);
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

  socketGetBySessionId(sessionId: SessionId) {
    return this.sockets.find(({ sessionId: thisSessionId }) => thisSessionId === sessionId);
  }

  // Subscribes given user to the given selector
  subscribe(selector: NodeSelector, userId: UserId) {
    this.subscriptions.push({
      userId,
      selector,
      dates: {
        create: new Date(),
      },
    });
  }

  // Unsubscribes the given user from the given selector
  unSubscribe(selector: NodeSelector, userId: UserId) {
    this.subscriptions.filter(
      (subscription) => subscription.userId !== userId || !subscription.selector.equals(selector),
    );
  }
}

export const UserManager = new Users();
