import { Core as SharedCore } from '../../shared/lib/Core';
import { action, ICoreConfig } from '../all';
import { Client } from 'rpc-websockets';

export class Core extends SharedCore {
  cfg: ICoreConfig;

  constructor(cfg: ICoreConfig) {
    super();
    this.cfg = cfg;

    const { host, port } = this.cfg;
    const url = `ws://${host}:${port}`;
    this.log(`Connecting to ${url}...`);
    const transport = new Client(url);
    transport.on('open', () => {
      transport.subscribe('dispatch');
      transport.on('dispatch', this.rx.bind(this));
      this.log('Connected.');
    });
    this.transport = transport;
  }

  get user() {
    return this.state.user;
  }

  tx(action: action): Promise<any> {
    return new Promise((resolve, reject) => {
      this.transport.dispatch(action);
      resolve(void 0);
    });
  }

  rx(action: action): Promise<any> {
    return new Promise((resolve) => {
      console.log('Received action ', action, this.date);
      resolve(void 0);
    });
  }

  destroy() {
    console.log('Will destroy');
  }
}
