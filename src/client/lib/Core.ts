import { Core as SharedCore } from '../../shared/lib/Core';
import { action, ICoreConfig } from '../all';

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
}
