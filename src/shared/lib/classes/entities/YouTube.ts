import Entity from './Entity';

export default class YouTube extends Entity {
  get videoId() {
    return this.data.videoId;
  }
}
