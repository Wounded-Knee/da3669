import { relationTypes, RelationTypes } from '../nodes/all';
import { server } from './redux/actionTypes';
import { INodeSelectorSerialized } from '../all';

function intersect(a, b) {
  const setB = new Set(b);
  return [...new Set(a)].filter((x) => setB.has(x));
}

export class NodeSelector {
  ids: string[] = [];
  self: boolean = true;
  rel: boolean | string[] = false;
  pop: boolean = false;

  constructor(...ids) {
    this.ids = ids;
  }

  load(obj) {
    const { ids, rel, self, pop } = obj;
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
        this.rel = relationTypes;
      }
    }
    return this;
  }

  populate() {
    this.pop = true;
    return this;
  }

  get relationTypes() {
    if (this.rel === false) return [];
    return this.rel instanceof Array
      ? this.rel.map((selector) => RelationTypes(selector))
      : relationTypes.reduce((relationTypeObjects, tuple) => {
          return [...relationTypeObjects, ...tuple.map(([selector]) => RelationTypes(selector))];
        }, []);
  }

  get serialize(): INodeSelectorSerialized {
    return {
      ids: this.ids,
      self: this.self,
      rel: this.rel,
      pop: this.pop,
    };
  }

  equals(foreignSelector: INodeSelectorSerialized): boolean {
    if (foreignSelector instanceof NodeSelector) {
      return JSON.stringify(foreignSelector.serialize) === JSON.stringify(this.serialize);
    } else {
      return JSON.stringify(foreignSelector) === JSON.stringify(this.serialize);
    }
  }
}
