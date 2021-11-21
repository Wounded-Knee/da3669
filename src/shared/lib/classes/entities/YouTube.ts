import { Entity } from './Entity';

const entityType = 'YOUTUBE';

export class YouTube extends Entity {
  get videoId() {
    return this.data.videoId;
  }
}

export default {
  entityType: {
    [entityType]: entityType,
  },
  entityClass: {
    [entityType]: YouTube,
  },
};
