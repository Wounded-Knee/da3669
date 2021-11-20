import Entity from './Entity';

export default class Image extends Entity {
  get src() {
    return this.data.src;
  }
}
