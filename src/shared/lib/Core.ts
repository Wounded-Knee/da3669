import { ICoreConfig, action, IEntity } from '../all';
import Kernel from './classes/Kernel';
import { entityClasses, entityTypes } from './classes/entities';

export class Core extends Kernel {
  cfg: ICoreConfig;
  transport: any;

  get all(): IEntity[] {
    return this.state.entities;
  }

  get date() {
    return this.cfg.date;
  }

  get store() {
    return this.cfg.store;
  }

  get state() {
    return this.store.getState();
  }

  get dispatch() {
    return this.store.dispatch;
  }

  getEntityById(soughtId) {
    return this.classify(this.all.find(({ id }) => id === soughtId));
  }

  getEntitiesByType(soughtType) {
    return this.classify(this.all.find(({ type }) => type === soughtType));
  }

  classify(entityData) {
    if (entityData === undefined) {
      return undefined;
    } else if (entityData instanceof entityClasses[entityTypes.ENTITY]) {
      console.warn('Why are you trying to classify a classified entity?');
    } else if (entityData instanceof Array) {
      return entityData.map((data) => this.classify(data));
    } else {
      const { type } = entityData;
      switch (type) {
        default:
          console.log('Found entity', entityData);
          return new entityClasses[type](this, entityData);
      }
    }
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
