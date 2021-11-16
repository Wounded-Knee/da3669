import { Core as SharedCore } from '../../shared/lib/Core';
import { ICoreConfig } from '../all';

export class Core extends SharedCore {
  cfg: ICoreConfig;

  constructor(cfg: ICoreConfig) {
    super();
    this.cfg = cfg;
  }
}
