import { relationTypes, RelationType } from './RelationType';
import { NodeId, INodeAll } from '../all';
import { Types, ObjectId } from 'mongoose';
const debug = {
  addNodeIds: false,
};
// @ts-ignore
const flatRelationTypes = relationTypes.flat(2).filter((relationType) => new RelationType(relationType).isPlural);

export interface INodeSelectorCfg {
  me: Types.ObjectId[];
  myRelations: {
    /*
     * null: Populate
     * true: hasRelation
     * false: lacksRelation
     */
    [key: string]: boolean | null;
  };
}

export class NodeSelector {
  cfg = <INodeSelectorCfg>{
    me: [],
    myRelations: {},
  };

  constructor(...nodeIds: NodeId[]) {
    return this.nodeIds(nodeIds);
  }

  debug() {
    return {
      me: this.cfg.me.map((id) => id.toString()),
      ...Object.keys(this.cfg.myRelations).reduce(
        (myRelations, relationType) => ({
          ...myRelations,
          [relationType]: (() => {
            switch (this.cfg.myRelations[relationType]) {
              case null:
                return 'Populate';
                break;

              case false:
                return 'Lacks Relation';
                break;

              case true:
                return 'Has Relation';
                break;
            }
          })(),
        }),
        {},
      ),
    };
  }

  serialize(): INodeSelectorCfg {
    return this.cfg;
  }

  deserialize(cfg: INodeSelectorCfg): NodeSelector {
    this.cfg = cfg;
    return this;
  }

  nodeId(nodeId: NodeId): NodeSelector {
    return this.nodeIds([nodeId]);
  }

  nodeIds(nodeIds: NodeId[]): NodeSelector {
    this.cfg.me = [
      ...this.cfg.me,
      ...nodeIds.filter((nodeId) => nodeId !== undefined).map((nodeId) => new Types.ObjectId(nodeId)),
    ];
    return this;
  }

  populateRelation(...relationTypes: string[]): NodeSelector {
    return this.addRelations(null, relationTypes);
  }

  lacksRelation(...relationTypes: string[]): NodeSelector {
    return this.addRelations(false, relationTypes);
  }

  hasRelation(...relationTypes: string[]): NodeSelector {
    return this.addRelations(true, relationTypes);
  }

  requiresRelations(): boolean {
    return !!Object.keys(this.cfg.myRelations).length;
  }

  addRelations(bool: boolean | null, relationTypes: string[]): NodeSelector {
    const theseRelationTypes = relationTypes.length ? relationTypes : flatRelationTypes;
    theseRelationTypes.forEach((relationType) => {
      this.cfg.myRelations[relationType] = bool;
    });
    return this;
  }

  equals(foreignSelector: INodeSelectorCfg | NodeSelector): boolean {
    if (foreignSelector instanceof NodeSelector) {
      return JSON.stringify(foreignSelector.serialize()) === JSON.stringify(this.serialize());
    } else {
      return JSON.stringify(foreignSelector) === JSON.stringify(this.serialize());
    }
  }

  // Server stub
  async getMyNodesAsync(): Promise<INodeAll[]> {
    throw new Error('Override Failed');
  }

  // Client stub
  getMyNodes(): INodeAll[] {
    throw new Error('Override Failed');
  }

  get nodes() {
    return undefined;
  }
}
