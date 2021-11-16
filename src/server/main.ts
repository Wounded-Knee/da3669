import HTTPServer from './lib/classes/HttpServer';
import { WebSocketServer } from './lib/classes/WebSocketServer';
import { Core } from './lib/Core';
import { stateManager } from './lib/stateManager/stateManager';
import { HTTP_SERVER_PORT, WS_SERVER_HOST, WS_SERVER_PORT } from './config';

const stateManagement = stateManager();
const httpServer = new HTTPServer({
  port: HTTP_SERVER_PORT,
});
const wsServer = new WebSocketServer({
  host: WS_SERVER_HOST,
  port: WS_SERVER_PORT,
});
const core = new Core({
  date: {
    serverLoad: new Date(),
  },
});

Promise.all([httpServer.initialize(), wsServer.initialize()]).then(() => {
  console.log('Ready');
});
