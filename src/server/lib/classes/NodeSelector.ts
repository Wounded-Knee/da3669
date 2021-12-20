import { INodeAll, relationTypes, RelationTypes } from '../../../shared/nodes/all';
import { defaultNodeType } from '../nodes/all';
import { NodeId } from '../../../shared/all';
const { model: DefaultModel } = defaultNodeType;

const flatRelationTypes = relationTypes.flat(2).filter((relationType) => RelationTypes(relationType).isPlural);

export interface INodeSelectorCfg {
  me: NodeId[];
  myRelations: {
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

  /**
   * @param bool null: Populate, bool: hasRelation / lacksRelation
   */
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

  async filterMatchingNodes(nodeArray: INodeAll[]): Promise<INodeAll[]> {
    const {
      cfg: { myRelations, me },
    } = this;

    if (!DefaultModel) {
      console.error('DefaultModel Problem ', DefaultModel);
      return [];
    }

    const myNodes = await Promise.all(
      me.map(async (myNodeId) => {
        const node = await DefaultModel.findById(myNodeId).exec();
        console.log('Map ', myNodeId, node);
        return node;
      }),
    );
    console.log('My Nodes ', myNodes);

    return nodeArray.filter((node) => {
      return Object.keys(myRelations).reduce((useThis: boolean, rel: string) => {
        if (myRelations[rel] === null) return useThis;

        const myRealRelations = myNodes.reduce((relations, myNode) => {
          return [...relations, ...(myNode.rel[RelationTypes(rel).literal.plural] || [])];
        }, []);

        return useThis || RelationTypes(rel).isLiteral
          ? myRealRelations.includes(node._id)
          : !!me.filter((value) => (node.rel[RelationTypes(rel).literal.plural] || []).includes(value)).length;
      }, false);
    });
  }

  get query(): any {
    const {
      cfg: { myRelations, me },
    } = this;

    const matches = {
      ...(me.length ? { _id: me } : {}),
      ...Object.keys(myRelations).reduce((match, rel) => {
        return myRelations[rel] !== null
          ? {
              ...match,
              [`rel.${RelationTypes(rel).literal.plural}`]: (() => {
                if (myRelations[rel] === true) {
                  return { $not: { $size: 0 } };
                } else if (myRelations[rel] === false) {
                  return { $size: 0 };
                } else {
                  return {};
                }
              })(),
            }
          : {};
      }, {}),
    };

    return [
      ...(Object.keys(matches).length
        ? [
            {
              $match: matches,
            },
          ]
        : []),
      ...Object.keys(myRelations).reduce((lookups, rel) => {
        if (myRelations[rel] === null) {
          return RelationTypes(rel).isLiteral
            ? [
                ...lookups,
                {
                  $lookup: {
                    from: 'bases',
                    localField: `rel.${RelationTypes(rel).literal.plural}`,
                    foreignField: '_id',
                    as: `rel.${RelationTypes(rel).literal.plural}`,
                  },
                },
              ]
            : [
                ...lookups,
                {
                  $lookup: {
                    from: 'bases',
                    localField: '_id',
                    foreignField: `rel.${RelationTypes(rel).literal.plural}`,
                    as: `rel.${RelationTypes(rel).virtual.plural}`,
                  },
                },
              ];
        } else {
          return [];
        }
      }, []),
    ];
  }

  async getNodes(): Promise<any> {
    const query = this.query;
    return await DefaultModel.aggregate(query).exec();
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectNodes = (...args: any): NodeSelector => new NodeSelector(...args);
