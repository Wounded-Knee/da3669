import Server from './Server';
import { Server as Wss } from 'rpc-websockets';
import { action } from '../../../shared/all';

export class WebSocketServer extends Server {
  host;
  port;
  methods;
  onReceiveCallbacks = [];
  wss;

  constructor({ host, port, methods }: { host: string; port: number; methods: string[] }) {
    super();
    this.host = host;
    this.port = port;
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
