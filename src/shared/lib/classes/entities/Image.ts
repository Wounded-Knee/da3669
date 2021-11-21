import { Entity } from './Entity';

const entityType = 'IMAGE';

export class Image extends Entity {
  get src() {
    return this.data.src;
  }
}

export default {
  entityType: {
    [entityType]: entityType,
  },
  entityClass: {
    [entityType]: Image,
  },
};
