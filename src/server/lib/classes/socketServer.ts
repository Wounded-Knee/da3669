import { App as uWS } from 'uWebSockets.js';
import { WS_SERVER_PORT } from '../../config';
import { TextDecoder } from 'util';
import { UserManager } from './User';

const decoder = new TextDecoder('utf-8');
export const socketServer = new Promise((resolve) => {
  uWS()
    .ws('/', {
      // config
      compression: 0,
      maxPayloadLength: 16 * 1024 * 1024,
      idleTimeout: 60,

      open: (ws) => UserManager.socketWelcome(ws),
      close: (ws, code, message) => UserManager.socketDismiss(ws),
      message: async (ws, message, isBinary) => {
        const {
          action: { type, payload },
          sessionId,
          promiseId,
        } = JSON.parse(decoder.decode(message));
        UserManager.socketUse(ws, sessionId);
        UserManager.orderAdd({
          sessionId,
          promiseId,
          type,
          payload,
        });
      },
    })
    .listen(WS_SERVER_PORT, (token) => {
      token
        ? console.log(`WS Listening @ port ${WS_SERVER_PORT}`)
        : console.log(`WS Failed to listen @ port ${WS_SERVER_PORT}`);
      resolve(token);
    });
});
