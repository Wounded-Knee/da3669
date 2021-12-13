import express from 'express';
import path from 'path';
import { pagesRouter } from '../../routes/pages-router';
import { staticsRouter } from '../../routes/statics-router';
import Kernel from '../../../shared/lib/classes/Kernel';
import { App as uWS } from 'uWebSockets.js';
import { getNonVirtualPaths, getNonVirtualPathsByName } from '../../../shared/relations/all';
import { getNodeTypeByName, defaultNodeType } from '../../../shared/nodes/all';
import { server, client } from '../../../shared/lib/redux/actionTypes';
import { setupPassport, getSessionById } from '../../authentication';
import session from 'express-session';
import { subscribeTo } from './NodeSubscriptions';
import { registerSocket } from './SocketRegistry';

const { model: DefaultModel } = defaultNodeType;

const debug = {
  messages: true,
  errors: true,
  responses: true,
  auth: true,
  reads: true,
};

//@ts-ignore
const decoder = new TextDecoder('utf-8');

const requiresUser = Object.freeze([
  server.ABSORB_NODES,
  server.SUBSCRIBE,
  server.SUBSCRIBE_BY_SELECTOR,
  server.GET_USER,
]);

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
    const {
      action: { type, payload },
      sessionId,
      promiseId,
    } = JSON.parse(decoder.decode(message));

    const session = getSessionById(sessionId);
    const userId = session ? session.userId : null;

    const respondWith = (action) => {
      const response = {
        action,
        promiseId,
      };
      if (debug.responses) this.log('RESPONSE ', response);
      ws.send(JSON.stringify(response));
    };

    if (!userId && requiresUser.indexOf(type)) {
      respondWith({
        type: client.SESSION_EXPIRED,
      });
      return false;
    }

    registerSocket(ws, userId.toString());

    if (debug.messages) this.log('MSG ', { type, payload, promiseId });
    try {
      switch (type) {
        case server.GET_USER:
          respondWith({
            type: client.ABSORB_NODES,
            payload: await DefaultModel.findById(userId),
          });
          break;

        case server.SUBSCRIBE_BY_SELECTOR:
          const selector = {
            TOP_LEVEL: { upstreams: { $eq: [] } },
          }[payload];

          const selectedNodes = await DefaultModel.find(selector);

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
            $or: [{ _id: { $in: nodeIdArray } }, { upstreams: { $in: nodeIdArray } }],
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
          this.log('Un-handled message type: ', type, payload);
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
          httpServer.use(session({ resave: true, saveUninitialized: true, secret: 'Laura Ingalls Wilder' }));

          // Passport Authentication
          setupPassport(this);

          // React
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
