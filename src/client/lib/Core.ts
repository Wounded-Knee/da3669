import { Core as SharedCore } from '../../shared/lib/Core';
import { action, ICoreConfig } from '../all';
import { Client } from 'rpc-websockets';
import { dispatch } from '../../shared/all';

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

  createEntity(data) {
    this.tx({ type: 'ADD_ENTITY', payload: data })
      .then((action) => {
        return this.store.dispatch(action);
      })
      .catch((...args) => this.log(...args));
  }

  tx(action: action): Promise<any> {
    return new Promise((resolve, reject) => {
      this.transport.call('dispatch', action).then(resolve).catch(reject);
    });
  }

  rx(action: action): Promise<any> {
    return new Promise((resolve) => {
      console.log('Received action ', action);
      this.store.dispatch(action);
      resolve(void 0);
    });
  }

  destroy() {
    console.log('Will destroy');
  }
}
