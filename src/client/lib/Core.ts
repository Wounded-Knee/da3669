import { Core as SharedCore } from '../../shared/lib/Core';
import { action, ICoreConfig } from '../all';
import { dispatch } from '../../shared/all';

export class Core extends SharedCore {
  cfg: ICoreConfig;

  constructor(cfg: ICoreConfig) {
    super();
    this.cfg = cfg;
  }

  get user() {
    return this.cfg.clientState.user;
  }

  get dispatch() {
    return this.cfg.clientDispatch;
  }

  xdispatch(action: action): boolean {
    console.log('Client Dispatch: ', action);
    return true;
  }
}
