import { Entity } from './Entity';

const entityType = 'USER';

export class User extends Entity {
  get name() {
    return this.data.name;
  }
}

export default {
  entityType: {
    [entityType]: entityType,
  },
  entityClass: {
    [entityType]: User,
  },
};
