import { relationTypes, RelationType, INodeAll } from '../nodes/all';
import { INodeSelectorSerialized, NodeId } from '../all';
import { server } from './redux/actionTypes';

const flatRelationTypes = relationTypes.flat(2).filter((relationType) => new RelationType(relationType).isPlural);

export interface INodeSelectorCfg {
  me: NodeId[];
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
    this.cfg.me = [...this.cfg.me, ...nodeIds];
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

  addRelations(bool: boolean | null, relationTypes: string[]): NodeSelector {
    const theseRelationTypes = relationTypes.length ? relationTypes : flatRelationTypes;
    theseRelationTypes.forEach((relationType) => {
      this.cfg.myRelations[relationType] = bool;
    });
    return this;
  }

  equals(foreignSelector: INodeSelectorCfg | NodeSelector): boolean {
    if (foreignSelector instanceof NodeSelector) {
      return JSON.stringify(foreignSelector.serialize) === JSON.stringify(this.serialize);
    } else {
      return JSON.stringify(foreignSelector) === JSON.stringify(this.serialize);
    }
  }
}
