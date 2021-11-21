import Kernel from '../Kernel';
const entityType = 'ENTITY';

export class Entity extends Kernel {
  data;
  core;
  isEntity = true;

  constructor(core, data) {
    super();
    this.core = core;
    this.data = data;
  }

  get id() {
    return this.data.id;
  }

  get type() {
    return this.data.type;
  }

  get text() {
    return this.data.text;
  }
}

export default {
  entityType: {
    [entityType]: entityType,
  },
  entityClass: {
    [entityType]: Entity,
  },
};
