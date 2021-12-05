import express from 'express';
import path from 'path';
import { pagesRouter } from '../../routes/pages-router';
import { staticsRouter } from '../../routes/statics-router';
import Kernel from '../../../shared/lib/classes/Kernel';
import { App as uWS } from 'uWebSockets.js';

//@ts-ignore
const decoder = new TextDecoder('utf-8');

// add an enum with Object.freeze for code safety
const MESSAGE_ENUM = Object.freeze({
  SELF_CONNECTED: 'SELF_CONNECTED',
  CLIENT_CONNECTED: 'CLIENT_CONNECTED',
  CLIENT_DISCONNECTED: 'CLIENT_DISCONNECTED',
  CLIENT_MESSAGE: 'CLIENT_MESSAGE',
});

class D3Server extends Kernel {
  express;
  http;
  uws;
  sockets = [];

  constructor({ httpPort, wsPort }: { wsPort: number; httpPort: number }) {
    super();

    this.log('Initializing...');

    this.whileInitializing(
      Promise.all([
        new Promise((resolve) => {
          const httpServer = express();
          this.express = httpServer;
          httpServer.set('view engine', 'ejs');

          httpServer.use('/assets', express.static(path.join(process.cwd(), 'assets')));
          httpServer.use(staticsRouter());
          httpServer.use(pagesRouter());

          this.http = httpServer.listen(httpPort, () => {
            this.log(`HTTP Listening @ port ${httpPort}`);
            resolve(void 0);
          });
        }),

        new Promise((resolve) => {
          this.uws = uWS()
            .ws('/', {
              // config
              compression: 0,
              maxPayloadLength: 16 * 1024 * 1024,
              idleTimeout: 60,

              open: (ws) => {
                // this handler is called when a client opens a ws connection with the server
                this.sockets.push(ws);
                this.log('How about we FUCK ON???');
              },

              message: (ws, message, isBinary) => {
                // called when a client sends a message
                const { type, payload } = JSON.parse(decoder.decode(message));
                this.log('Message for you, sir: ', type, payload);
              },

              close: (ws, code, message) => {
                // called when a ws connection is closed
                this.log('Somebody fucked off.', ws);
              },
            })
            .listen(wsPort, (token) => {
              token ? this.log(`WS Listening @ port ${wsPort}`) : this.log(`WS Failed to listen @ port ${wsPort}`);
              resolve(token);
            });
        }),
      ]),
    );
  }
}
Object.assign(D3Server.prototype, {
  _className: 'NodeServer',
  _showDebug: true,
});

export default D3Server;
