import HTTPServer from './lib/classes/HttpServer';
import { WebSocketServer } from './lib/classes/WebSocketServer';
import { Core } from './lib/Core';
import { store } from './lib/stateManager/store';
import { HTTP_SERVER_PORT, WS_SERVER_HOST, WS_SERVER_PORT } from './config';
import { actionTypes } from './lib/stateManager/reducer';

const httpServer = new HTTPServer({
  port: HTTP_SERVER_PORT,
});
const wsServer = new WebSocketServer({
  host: WS_SERVER_HOST,
  port: WS_SERVER_PORT,
  methods: Object.values(actionTypes),
});
const core = new Core({
  date: {
    serverLoad: new Date(),
  },
  store,
  server: wsServer,
});

Promise.all([httpServer.initialize(), wsServer.initialize()]).then(() => {
  console.log('Ready');
});
