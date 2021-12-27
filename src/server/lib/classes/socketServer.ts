import { App as uWS } from 'uWebSockets.js';
import { WS_SERVER_PORT } from '../../config';
import { TextDecoder } from 'util';
import { UserManager } from './User';
import { processEvent, eventType } from './controller';

const decoder = new TextDecoder('utf-8');
export const socketServer = new Promise((resolve) => {
  uWS()
    .ws('/', {
      // config
      compression: 0,
      maxPayloadLength: 16 * 1024 * 1024,
      idleTimeout: 60,

      open: async (ws) => await processEvent(eventType.OPEN, ws),
      close: async (ws, code, message) => await processEvent(eventType.CLOSE, { ws, code, message }),
      message: async (ws, message, isBinary) => {
        const response = await processEvent(eventType.MESSAGE, { ws, message, isBinary });
        ws.send(JSON.stringify(response));
      },
      // {
      //   //console.log('Message ', decoder.decode(message));
      //   const {
      //     action: { type, payload },
      //     sessionId,
      //     promiseId,
      //   } = JSON.parse(decoder.decode(message));
      //   UserManager.socketUse(ws, sessionId);
      //   UserManager.orderAdd({
      //     sessionId,
      //     promiseId,
      //     type,
      //     payload,
      //   });
      // },
    })
    .listen(WS_SERVER_PORT, (token) => {
      token
        ? console.log(`WS Listening @ port ${WS_SERVER_PORT}`)
        : console.log(`WS Failed to listen @ port ${WS_SERVER_PORT}`);
      resolve(token);
    });
});
