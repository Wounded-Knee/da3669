import { ICoreConfig, action, IEntity } from '../all';
import Kernel from './classes/Kernel';

export class Core extends Kernel {
  cfg: ICoreConfig;

  get all(): IEntity[] {
    return [];
  }

  get date() {
    return this.cfg.date;
  }

  get store() {
    return this.cfg.store;
  }

  // Dispatches a message to the converse core via network
  tx(action: action): Promise<any> {
    throw new Error('Failed to override Core.tx()');
  }

  // Receives a message from the converse core via network
  rx(action: action): Promise<any> {
    throw new Error('Failed to override Core.rx()');
  }
}
Object.assign(Core.prototype, {
  _className: 'Core',
  _showDebug: true,
});
