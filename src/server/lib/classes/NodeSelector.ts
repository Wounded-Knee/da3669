import { defaultNodeType, INodeAll, relationTypes, RelationTypes } from '../../../shared/nodes/all';
import { NodeId } from '../../../shared/all';
const { model: DefaultModel } = defaultNodeType;

const flatRelationTypes = relationTypes.flat(2).filter((relationType) => RelationTypes(relationType).isPlural);

interface INodeSelectorCfg {
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

  filterMatchingNodes(nodeArray: INodeAll[]): INodeAll[] {
    const {
      cfg: { myRelations, me },
    } = this;

    return nodeArray.filter((node) => {
      return Object.keys(myRelations).reduce((useThis: boolean, rel: string) => {
        if (myRelations[rel] === null) return useThis;

        return useThis || RelationTypes(rel).isLiteral
          ? !!me.filter((value) => node.rel[rel].includes(value)).length
          : {
              [`rel.${RelationTypes(rel).literal.plural}`]:
                myRelations[rel] === null
                  ? [] // Must have zero relations of this type
                  : { [myRelations[rel] ? '$in' : '$nin']: me.map((idObj) => idObj.toString()) }, // Must have (or lack) one relation to me of this type
            };
      }, false);
    });

    console.log(selectors);
    // @ts-ignore
    return selectors;
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

  async get(): Promise<any> {
    const query = this.query;
    return await DefaultModel.aggregate(query).exec();
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectNodes = (...args: any): NodeSelector => new NodeSelector(...args);
