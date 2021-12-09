import express from 'express';
import path from 'path';
import { pagesRouter } from '../../routes/pages-router';
import { staticsRouter } from '../../routes/statics-router';
import Kernel from '../../../shared/lib/classes/Kernel';
import { App as uWS } from 'uWebSockets.js';
import { getNonVirtualPaths, getNonVirtualPathsByName } from '../../../shared/relations/all';
import { getNodeTypeByName, defaultNodeType } from '../../../shared/nodes/all';
import { server, client } from '../../../shared/lib/redux/actionTypes';

const { model: DefaultModel } = defaultNodeType;

const debug = {
  messages: true,
};

//@ts-ignore
const decoder = new TextDecoder('utf-8');

class D3Server extends Kernel {
  express;
  http;
  uws;
  sockets = [];

  open(ws) {
    // this handler is called when a client opens a ws connection with the server
    this.sockets.push(ws);
    this.log('How about we FUCK ON???');
  }

  async message(ws, message, isBinary) {
    // called when a client sends a message
    const respondWith = (data) => ws.send(JSON.stringify(data));
    const { type, payload } = JSON.parse(decoder.decode(message));
    if (debug.messages) this.log('MSG ', type, payload);
    try {
      switch (type) {
        case server.GET_NODE_BY_ID:
          const _id = payload;
          const populatePaths = getNonVirtualPaths();
          const gotById = await DefaultModel.findById(_id).populate(populatePaths);
          const { model } = getNodeTypeByName(gotById.kind);
          const downStreams = await model.find({ upstreams: _id });

          [...downStreams, gotById._doc].forEach((node) => {
            respondWith({
              type: client.ABSORB_NODE,
              payload: node,
            });
          });
          break;

        case server.ABSORB_NODE:
          const node = new DefaultModel(payload);
          node
            .save()
            .then((node) => {
              respondWith({
                type: client.ABSORB_NODE,
                payload: node,
              });
            })
            .catch((e) => {
              respondWith({
                type: client.ERROR,
                payload: e,
              });
            });
          break;

        default:
          this.log('Un-handled message type: ', type, payload);
          break;
      }
    } catch (e) {
      respondWith({
        type: client.ERROR,
        payload: e.message,
      });
    }
  }

  close(ws, code, message) {
    // called when a ws connection is closed
    const before = this.sockets.length;
    this.sockets = this.sockets.filter((socket) => socket !== ws);
    this.log(`${before - this.sockets.length} of ${before} users fucked off.`, ws);
  }

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
              open: this.open.bind(this),
              message: this.message.bind(this),
              close: this.close.bind(this),
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
