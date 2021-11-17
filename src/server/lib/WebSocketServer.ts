import WebSocket from '../../../shared/lib/classes/WebSocket';
import { Server as Wss } from 'rpc-websockets';
import { action } from '../../../shared/all';

export class WebSocketServer extends WebSocket {
  methods;
  onReceiveCallbacks = [];
  wss;

  constructor({ host, port, methods }: { host: string; port: number; methods: string[] }) {
    super({ host, port, methods });
    this.methods = methods;

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
        methods.forEach((method) => {
          this.wss.register(method);
        });
        this.wss.event('dispatch');
        this.wss.register('dispatch', this.receive.bind(this));
      }),
    );
  }

  receive(action: action): Promise<any[]> {
    return Promise.all(this.onReceiveCallbacks.map((cb) => cb(action)));
  }

  emit(...args) {
    this.wss.emit(...args);
  }

  event(...args) {
    this.wss.event(...args);
  }

  onReceive(callback) {
    this.onReceiveCallbacks.push(callback);
  }
}
Object.assign(WebSocketServer.prototype, {
  _className: 'WebSocketServer',
  _showDebug: true,
});
