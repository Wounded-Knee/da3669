import HTTPServer from './httpServer';
import WebSocketServer from './lib/WebSocketServer';

const httpServer = new HTTPServer();
const wsServer = new WebSocketServer();

httpServer.initialize().then(() => {
  console.log('HTTP Server Running');
});
