export default class Entity {
  data;
  core;
  isEntity = true;

  constructor(core, data) {
    this.core = core;
    this.data = data;
  }

  get id() {
    return this.data.id;
  }

  get type() {
    return this.data.type;
  }
}
