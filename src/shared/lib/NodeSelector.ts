import { relationTypes, RelationTypes } from '../nodes/all';
import { INodeSelectorSerialized, NodeId } from '../all';

export class NodeSelector {
  ids: string[] = [];
  self: boolean = true;
  rel: boolean | string[] = false;
  pop: boolean = false;

  constructor(...ids: NodeId[]) {
    this.ids = ids;
  }

  load(obj: INodeSelectorSerialized): NodeSelector {
    const { ids, rel, self, pop } = obj;
    this.self = self;
    this.ids = ids;
    this.rel = rel;
    this.pop = pop;
    return this;
  }

  id(id: NodeId): NodeSelector {
    this.ids.push(id);
    return this;
  }

  notSelf(): NodeSelector {
    this.self = false;
    return this;
  }

  andRelations(...relationTypes: string[]): NodeSelector {
    if (this.rel !== true) {
      if (relationTypes.length === 0) {
        this.rel = true;
      } else {
        this.rel = relationTypes;
      }
    }
    return this;
  }

  populate(): NodeSelector {
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
