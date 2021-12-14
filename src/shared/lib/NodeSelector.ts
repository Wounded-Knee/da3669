import { relationTypes } from '../nodes/all';
import { server } from './redux/actionTypes';

function intersect(a, b) {
  const setB = new Set(b);
  return [...new Set(a)].filter((x) => setB.has(x));
}

export class NodeSelector {
  ids = [];
  self = true;
  rel = false;
  pop = false;

  constructor(...ids) {
    this.ids = ids;
  }

  load(obj) {
    const {
      payload: { ids, rel, self, pop },
    } = obj;
    this.self = self;
    this.ids = ids;
    this.rel = rel;
    this.pop = pop;
    return this;
  }

  id(id) {
    this.ids.push(id);
    return this;
  }

  notSelf() {
    this.self = false;
    return this;
  }

  andRelations(...relationTypes) {
    if (this.rel !== true) {
      if (relationTypes.length === 0) {
        this.rel = true;
      } else {
        //@ts-ignore
        this.rel = relationTypes;
      }
    }
    return this;
  }

  populate() {
    this.pop = true;
    return this;
  }

  get serialize() {
    return JSON.stringify([this.ids, this.self, this.rel, this.pop]);
  }

  get serverAction() {
    return {
      type: server.SUBSCRIBE_BY_SELECTOR,
      payload: {
        ids: this.ids,
        self: this.self,
        pop: this.pop,
        rel: this.rel,
      },
    };
  }
}
