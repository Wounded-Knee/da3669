import { Core as SharedCore } from '../../shared/lib/Core';
import { ICoreConfig } from '../all';
import { action } from '../../shared/all';

export class Core extends SharedCore {
  cfg: ICoreConfig;

  constructor(cfg: ICoreConfig) {
    super();
    this.cfg = cfg;
    this.wss.onReceive((action: action) => {
      try {
        return this.rx(action);
      } catch (e) {
        this.log('ERROR: ', e);
        return Promise.reject();
      }
    });
  }

  rx(action: action): Promise<any> {
    return new Promise((resolve) => {
      this.dispatch(action);
      setTimeout(() => {
        console.log('New state ', this.state);
        resolve(void 0);
      }, 1000);
    });
  }

  get wss() {
    return this.cfg.server;
  }

  get dispatch() {
    return this.cfg.stateManager[1];
  }

  get state() {
    return this.cfg.stateManager[0].getState();
  }
}
