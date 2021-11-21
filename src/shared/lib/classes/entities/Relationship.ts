import { Entity } from './Entity';

const entityType = 'RELATIONSHIP';

export class Relationship extends Entity {
  get by() {
    return this.data.by;
  }

  get to() {
    return this.data.to;
  }
}

export default {
  entityType: {
    [entityType]: entityType,
  },
  entityClass: {
    [entityType]: Relationship,
  },
};
