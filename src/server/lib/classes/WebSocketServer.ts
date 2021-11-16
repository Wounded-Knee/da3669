import Server from './Server';
import { Server as Wss } from 'rpc-websockets';

export class WebSocketServer extends Server {
  host;
  port;
  wss;

  constructor({ host, port }: { host: string; port: number }) {
    super();
    this.host = host;
    this.port = port;

    this.whileInitializing(
      new Promise((resolve) => {
        this.log('Initializing...');
        this.wss = new Wss({
          port,
          host,
        });
        this.wss.on('listening', () => {
          this.log(`Listening on port ${port}`);
          resolve(void 0);
        });
      }),
    );
  }
}
Object.assign(WebSocketServer.prototype, {
  _className: 'WebSocketServer',
  _showDebug: true,
});
