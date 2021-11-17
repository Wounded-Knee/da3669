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
        this.tx({ type: 'TEST_GOOD', payload: 0 });
        console.log('New state ', this.state);
        resolve(void 0);
      }, 1000);
    });
  }

  tx(action: action): Promise<any> {
    return new Promise((resolve) => {
      this.log('Emit ', action);
      this.wss.emit('dispatch', action);
      resolve(void 0);
    });
  }

  get wss() {
    return this.cfg.server;
  }

  get state() {
    return this.store.getState();
  }

  get dispatch() {
    return this.store.dispatch;
  }
}
