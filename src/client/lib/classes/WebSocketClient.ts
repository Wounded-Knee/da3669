import { Client as Wsc } from 'rpc-websockets';
import Client from './Client';
import { action } from '../../../shared/all';

export class WebSocketClient extends Client {
  host;
  port;
  wsc;

  constructor({ host, port }: { host: string; port: number }) {
    super();
    this.host = host;
    this.port = port;

    const url = `ws://${host}:${port}`;

    this.whileInitializing(
      new Promise((resolve) => {
        this.log(`Connecting to ${url}...`);
        this.wsc = new Wsc(url);
        this.wsc.on('open', () => {
          this.log('Connected.');
          resolve(void 0);
        });
      }),
    );
  }

  dispatch(action: action) {
    return this.wsc.call('dispatch', action);
  }
}
Object.assign(WebSocketClient.prototype, {
  _className: 'WebSocketClient',
  _showDebug: true,
});
