import { App as uWS } from 'uWebSockets.js';
import { WS_SERVER_PORT } from '../../config';
import { server, client } from '../../../shared/lib/redux/actionTypes';
import { getSessionById } from '../../authentication';
import { getNodeTypeByName, defaultNodeType } from '../../../shared/nodes/all';
import { registerSocket } from './SocketRegistry';
import { subscribeTo } from './NodeSubscriptions';

//@ts-ignore
const decoder = new TextDecoder('utf-8');
const { model: DefaultModel } = defaultNodeType;
const debug = {
  messages: true,
  errors: true,
  responses: true,
  auth: true,
  reads: true,
};
const requiresUser = Object.freeze([
  server.ABSORB_NODES,
  server.SUBSCRIBE,
  server.SUBSCRIBE_BY_SELECTOR,
  server.GET_USER,
  server.ECONOMY_TRANSFER,
]);
let sockets = [];

export const socketServer = new Promise((resolve) => {
  uWS()
    .ws('/', {
      // config
      compression: 0,
      maxPayloadLength: 16 * 1024 * 1024,
      idleTimeout: 60,

      open: (ws) => {
        sockets.push(ws);
        console.log('How about we FUCK ON???');
      },

      message: async (ws, message, isBinary) => {
        // called when a client sends a message
        const {
          action: { type, payload },
          sessionId,
          promiseId,
        } = JSON.parse(decoder.decode(message));

        const { userId } = getSessionById(sessionId);

        const respondWith = (action) => {
          const response = {
            action,
            promiseId,
          };
          if (debug.responses) console.log('RESPONSE ', response);
          ws.send(JSON.stringify(response));
        };

        const getNetWorthByUserId = async (userId) => {
          const { model: EconomyModel } = getNodeTypeByName('Economy');
          const economyNodes = await EconomyModel.find({
            author: userId,
            kind: 'Economy',
          });
          return economyNodes.reduce((netWorth, economyNode) => {
            const { qty } = economyNode;
            return netWorth - qty;
          }, 0);
        };

        if (!userId && requiresUser.indexOf(type)) {
          respondWith({
            type: client.SESSION_EXPIRED,
          });
          return false;
        }

        registerSocket(ws, userId.toString());

        if (debug.messages) console.log('MSG ', { type, payload, promiseId });
        try {
          switch (type) {
            case server.ECONOMY_TRANSFER:
              const { model: EconomyModel } = getNodeTypeByName('Economy');
              const { qty, destinationId } = payload;
              new EconomyModel({
                qty,
                destinationId,
                author: userId,
              })
                .save()
                .then(async (transaction) => {
                  respondWith({
                    type: client.UPDATE_NET_WORTH,
                    payload: await getNetWorthByUserId(userId),
                  });
                });
              break;

            case server.GET_USER:
              const netWorth = await getNetWorthByUserId(userId);
              respondWith({
                type: client.ABSORB_NODES,
                payload: await DefaultModel.findById(userId),
              });
              respondWith({
                type: client.UPDATE_NET_WORTH,
                payload: netWorth,
              });
              break;

            case server.SUBSCRIBE_BY_SELECTOR:
              let selectedNodes;
              if (typeof payload === 'string') {
                const selector = {
                  TOP_LEVEL: {
                    rel: {
                      upstreams: [],
                    },
                  },
                }[payload];
                selectedNodes = await DefaultModel.find(selector);
              } else {
                // Process selector object
                selectedNodes = [];
              }

              subscribeTo(selectedNodes, userId).then(() => {
                respondWith({
                  type: client.ABSORB_NODES,
                  payload: selectedNodes,
                });
              });
              break;

            case server.SUBSCRIBE:
              const nodeIdArray = payload;
              // Retrieve each subscribed node and its downstreams
              const nodesOfInterest = await DefaultModel.find({
                $or: [{ _id: { $in: nodeIdArray } }, { rel: { upstreams: { $in: nodeIdArray } } }],
              });

              subscribeTo(nodesOfInterest, userId).then(() => {
                //Return each node
                respondWith({
                  type: client.ABSORB_NODES,
                  payload: nodesOfInterest,
                });
              });
              break;

            case server.ABSORB_NODES:
              Promise.all(
                payload.map((nodeData) =>
                  new DefaultModel({
                    ...nodeData,
                    author: userId,
                  }).save(),
                ),
              ).then((newNodes) => {
                respondWith({
                  type: client.ABSORB_NODES,
                  payload: newNodes,
                });
              });
              break;

            default:
              console.log('Un-handled message type: ', type, payload);
              respondWith({
                type: client.NOOP,
              });
              break;
          }
        } catch (e) {
          if (debug.errors) console.error(e);
          respondWith({
            type: client.ERROR,
            payload: {
              message: e.message,
              action: { type, payload },
            },
          });
        }
      },

      close: (ws, code, message) => {
        // called when a ws connection is closed
        const before = sockets.length;
        sockets = sockets.filter((socket) => socket !== ws);
        console.log(`${before - sockets.length} of ${before} users fucked off.`, ws);
      },
    })
    .listen(WS_SERVER_PORT, (token) => {
      token
        ? console.log(`WS Listening @ port ${WS_SERVER_PORT}`)
        : console.log(`WS Failed to listen @ port ${WS_SERVER_PORT}`);
      resolve(token);
    });
});
