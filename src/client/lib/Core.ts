import { Core as SharedCore } from '../../shared/lib/Core';
import { action, ICoreConfig } from '../all';

export class Core extends SharedCore {
  cfg: ICoreConfig;

  constructor(cfg: ICoreConfig) {
    super();
    this.cfg = cfg;

    this.client.on('open', () => {
      this.client.subscribe('dispatch');
      this.client.on('dispatch', this.rx.bind(this));
    });
  }

  get user() {
    return this.state.user;
  }

  get client() {
    return this.cfg.client;
  }

  tx(action: action): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.dispatch(action);
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
