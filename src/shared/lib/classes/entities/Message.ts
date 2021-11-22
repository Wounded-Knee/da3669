import { Entity } from './Entity';

const entityType = 'MESSAGE';

export class Message extends Entity {}

export default {
  entityType: {
    [entityType]: entityType,
  },
  entityClass: {
    [entityType]: Message,
  },
};
