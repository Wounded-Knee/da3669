import { ICoreConfig, action, IEntity } from '../all';

export class Core {
  cfg: ICoreConfig;

  get all(): IEntity[] {
    return [];
  }

  get date() {
    return this.cfg.date;
  }

  // Dispatches a message to the converse core via network
  tx(action: action): boolean {
    throw new Error('Failed to override Core.tx()');
    return false;
  }

  // Receives a message from the converse core via network
  rx(action: action): boolean {
    throw new Error('Failed to override Core.rx()');
    return false;
  }
}
