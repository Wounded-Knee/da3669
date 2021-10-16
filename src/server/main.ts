import HTTPServer from './httpServer';
import wsServer from './wsServer';

const httpServer = new HTTPServer();
httpServer.initialize().then(() => {
  console.log('HTTP Server Running');
});
