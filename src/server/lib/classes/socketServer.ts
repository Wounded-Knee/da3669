import { App as uWS } from 'uWebSockets.js';
import { WS_SERVER_PORT } from '../../config';
import { server, client } from '../../../shared/lib/redux/actionTypes';
import { getSessionById } from '../../authentication';
import { registerSocket, getRecordsBySocket, ISocketRecord } from './SocketRegistry';
import { processAction } from './processAction';
import { getBroadcastPlan } from './NodeSubscriptions';
import { TextDecoder } from 'util';
import { ISession } from '../../../shared/all';

const decoder = new TextDecoder('utf-8');
const debug = {
  messages: false,
  errors: true,
  responses: false,
  auth: false,
  reads: false,
};
const requiresUser = Object.freeze([
  server.ABSORB_NODES,
  server.SUBSCRIBE,
  server.SUBSCRIBE2,
  server.SUBSCRIBE_BY_SELECTOR,
  server.GET_USER,
  server.ECONOMY_TRANSFER,
]);
let sockets = [];

interface ISessionInfo extends ISession {
  socketRecords: ISocketRecord[];
}

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
        const sessionInfo = <ISessionInfo>{
          ...getSessionById(sessionId),
          socketRecords: getRecordsBySocket(ws),
        };
        console.log('Session Info: ');
        console.dir(sessionInfo, { depth: null });
        const { userId } = sessionInfo;
        const teresaLaughlin = {
          type,
          payload,
          sessionId,
          promiseId,
          userId,
          ws,
          registryRecord: getRecordsBySocket(ws),
          honorRequest: !(!userId && requiresUser.indexOf(type)),
          respondWith: (action) => {
            const response = {
              action,
              promiseId,
            };
            if (debug.responses) console.log('RESPONSE ', response);
            ws.send(JSON.stringify(response));
          },
        };
        if (userId) registerSocket(ws, userId.toString(), sessionId);
        processAction(teresaLaughlin, (changedNodes) => {
          console.log('Changed Nodes: ');
          console.dir(changedNodes, { depth: null });
          console.log('Broadcast Plan: ', getBroadcastPlan(changedNodes));
        });
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
