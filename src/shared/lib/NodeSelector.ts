import { relationTypes, RelationType } from '../nodes/all';
import { INodeSelectorSerialized, NodeId } from '../all';
import { server } from './redux/actionTypes';

export class NodeSelector {
  ids: string[] = [];
  self: boolean = true;
  rel: boolean | string[] = false;
  without: boolean | string[] = false;
  pop: boolean = false;

  constructor(...ids: NodeId[]) {
    this.ids = ids.filter((id) => typeof id === 'string');
  }

  load(obj: INodeSelectorSerialized): NodeSelector {
    const { ids, rel, self, pop, without } = obj;
    this.self = self;
    this.ids = ids;
    this.rel = rel;
    this.pop = pop;
    this.without = without;
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

  withoutRelations(...relationTypes: string[]): NodeSelector {
    if (this.without !== true) {
      if (relationTypes.length === 0) {
        this.without = true;
      } else {
        this.without = relationTypes;
      }
    }
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
      ? this.rel.map((selector) => new RelationType(selector))
      : relationTypes.reduce((relationTypeObjects, tuple) => {
          return [...relationTypeObjects, ...tuple.map(([selector]) => new RelationType(selector))];
        }, []);
  }

  get withoutRelationTypes() {
    if (this.without === false) return [];
    return this.without instanceof Array
      ? this.without.map((selector) => RelationTypes(selector))
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
      without: this.without,
    };
  }

  equals(foreignSelector: INodeSelectorSerialized): boolean {
    if (foreignSelector instanceof NodeSelector) {
      return JSON.stringify(foreignSelector.serialize) === JSON.stringify(this.serialize);
    } else {
      return JSON.stringify(foreignSelector) === JSON.stringify(this.serialize);
    }
  }

  get serverAction() {
    return {
      type: server.SUBSCRIBE,
      payload: this.serialize,
    };
  }

  get serverUnsubscribe() {
    return {
      type: server.UNSUBSCRIBE,
      payload: this.serialize,
    };
  }
}
