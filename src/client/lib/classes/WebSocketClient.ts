import { Client as Wsc } from 'rpc-websockets';
import WebSocket from '../../../shared/lib/classes/WebSocket';
import { action } from '../../../shared/all';

export class WebSocketClient extends WebSocket {
  wsc;

  constructor({ host, port }: { host: string; port: number }) {
    super({ host, port });
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

  on(...args) {
    return this.wsc.on(...args);
  }

  subscribe(...args) {
    return this.wsc.subscribe(...args);
  }

  dispatch(action: action) {
    return this.wsc.call('dispatch', action);
  }
}
Object.assign(WebSocketClient.prototype, {
  _className: 'WebSocketClient',
  _showDebug: true,
});
