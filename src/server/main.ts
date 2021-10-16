import ServerStore from './lib/ServerStore';
import HTTPServer from './httpServer';
import WebSocketServer from './lib/WebSocketServer';
import { STORE_DB_FILE } from './config';

const store = new ServerStore({ db: STORE_DB_FILE });
const httpServer = new HTTPServer();
const wsServer = new WebSocketServer({
  store,
});

Promise.all([
  httpServer.initialize().then(() => {
    console.log('HTTP Server Running');
  }),

  wsServer.initialize().then(() => {
    console.log('WS Server Running');
  }),
]).then(() => {
  console.log('Ready');
});
