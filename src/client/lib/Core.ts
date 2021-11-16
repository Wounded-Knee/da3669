import { Core as SharedCore } from '../../shared/lib/Core';
import { action, ICoreConfig } from '../all';

export class Core extends SharedCore {
  cfg: ICoreConfig;

  constructor(cfg: ICoreConfig) {
    super();
    this.cfg = cfg;

    this.wsc.on('open', () => {
      this.wsc.subscribe('dispatch');
      this.wsc.on('dispatch', this.rx.bind(this));
    });
  }

  get user() {
    return this.cfg.clientState.user;
  }

  get dispatch() {
    return this.cfg.clientDispatch;
  }

  get wsc() {
    return this.cfg.client;
  }

  tx(action: action): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cfg.serverDispatch(action);
      resolve(void 0);
    });
  }

  rx(action: action): Promise<any> {
    return new Promise((resolve) => {
      console.log('Received action ', action);
      resolve(void 0);
    });
  }
}
