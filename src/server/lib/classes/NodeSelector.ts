import { relationTypes, RelationType } from '../../../shared/lib/RelationType';
import { defaultModel } from '../nodes/all';
import { NodeSelector as SuperNodeSelector } from '../../../shared/lib/NodeSelector';
import { inspect } from 'util';
import { INodeAll } from '../../../shared/all';
import mongoose from 'mongoose';

const debug = {
  getNodes: true,
  filterMatchingNodes: false,
};

const {
  Types: { ObjectId },
} = mongoose;

export class NodeSelector extends SuperNodeSelector {
  get query(): any {
    const {
      cfg: { myRelations, me },
    } = this;

    const matches = {
      ...(me.length ? { _id: { $in: me.map((id) => new ObjectId(id)) } } : {}),
      ...Object.keys(myRelations).reduce((match, rel) => {
        return myRelations[rel] !== null
          ? {
              ...match,
              [`rel.${new RelationType(rel).literal.plural}`]: (() => {
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
          return new RelationType(rel).isLiteral
            ? [
                ...lookups,
                {
                  $lookup: {
                    from: 'bases',
                    localField: `rel.${new RelationType(rel).literal.plural}`,
                    foreignField: '_id',
                    as: `rel.${new RelationType(rel).literal.plural}`,
                  },
                },
              ]
            : [
                ...lookups,
                {
                  $lookup: {
                    from: 'bases',
                    localField: '_id',
                    foreignField: `rel.${new RelationType(rel).literal.plural}`,
                    as: `rel.${new RelationType(rel).virtual.plural}`,
                  },
                },
              ];
        } else {
          return [];
        }
      }, []),
    ];
  }

  extract(baseNodes: INodeAll[]): { baseNodes: INodeAll[]; extracts: INodeAll[] } {
    return {
      baseNodes: baseNodes.reduce((nodes, thisNode) => {
        return [
          ...nodes,
          {
            ...thisNode,
            rel: {
              ...Object.keys(thisNode.rel).reduce((rel, relationType) => {
                return {
                  ...rel,
                  ...(thisNode.rel[relationType]
                    ? thisNode.rel[relationType].reduce((rel, relation) => {
                        // @ts-ignore
                        return { ...rel, [relationType]: relation instanceof Object ? [relation._id] : relation };
                      }, {})
                    : {}),
                };
              }, []),
            },
          },
        ];
      }, []),
      extracts: baseNodes.reduce((nodes, thisNode) => {
        return [
          ...nodes,
          ...Object.keys(thisNode.rel).reduce((nodes, relationType) => {
            return [
              ...nodes,
              ...(thisNode.rel[relationType]
                ? thisNode.rel[relationType].reduce((nodes, relation) => {
                    // @ts-ignore
                    console.log('Relation ', relation instanceof ObjectId);
                    // @ts-ignore
                    return [...nodes, ...(relation instanceof ObjectId ? [] : [relation])];
                  }, [])
                : []),
            ];
          }, []),
        ];
      }, []),
    };
  }

  async getNodes(): Promise<INodeAll[]> {
    const query = this.query;
    try {
      const { baseNodes, extracts } = this.extract(await defaultModel.aggregate(query).exec());
      const nodes = this.requiresRelations() ? extracts : baseNodes;
      if (debug.getNodes) console.log('Nodes ', nodes, inspect(query, { depth: null }));
      return nodes;
    } catch (e) {
      console.error('Query Error ', inspect(query, { depth: null }), e);
      return [];
    }
  }

  async getMyNodesAsync(): Promise<INodeAll[]> {
    return await Promise.all(
      this.cfg.me.map(async (myNodeId) => {
        try {
          const node = await defaultModel.findById(myNodeId).exec();
          console.log('Map ', myNodeId, node);
          return node;
        } catch (e) {
          console.error('Problem finding myNodes ', myNodeId, this.cfg.me, e);
        }
      }),
    );
  }

  async getAllMyRelations(): Promise<{ [key: string]: mongoose.Types.ObjectId[] }> {
    const myNodes = await this.getMyNodesAsync();
    return myNodes.reduce((relations, myNode) => {
      return {
        ...relations,
        ...Object.keys(this.cfg.myRelations).reduce((relations, relationType) => {
          console.log(myNode, myNode.rel);
          return {
            ...relations,
            [relationType]: ((myNode.rel && myNode.rel[new RelationType(relationType).literal.plural]) || []).map(
              (objectId) => objectId.toString(),
            ),
          };
        }, {}),
      };
    }, {});
  }

  async filterMatchingNodes(nodeArray: INodeAll[]): Promise<INodeAll[]> {
    const {
      cfg: { myRelations, me },
    } = this;

    const myNodes = await this.getMyNodesAsync();
    if (debug.filterMatchingNodes)
      console.log('My Nodes ', myNodes, 'Object.keys(myRelations)', Object.keys(myRelations));

    return nodeArray.filter((node) => {
      return Object.keys(myRelations).reduce((useThis: boolean, rel: string) => {
        if (myRelations[rel] === null) return useThis;

        // Combines all base node relations of [rel] type into one array
        const combinedBaseNodeRelations = (this.getAllMyRelations()[rel] || []).map((id) => id.toString());
        const candidateNodeRelations = ((node.rel && node.rel[new RelationType(rel).literal.plural]) || []).map(
          (objectId) => objectId.toString(),
        );
        const baseNodeRelatesToThisNode = combinedBaseNodeRelations.includes(node._id);
        const thisNodeRelatesToBaseNode = !!me.filter((baseNodeId) =>
          candidateNodeRelations.includes(baseNodeId.toString()),
        ).length;

        if (debug.filterMatchingNodes) {
          console.log(`My Real Relations (${rel})`, combinedBaseNodeRelations);
          console.log(
            `Candidate Relations (${new RelationType(rel).literal.plural})`,
            node.rel[new RelationType(rel).literal.plural] || [],
          );
          console.log('Base Node IDs ', me);
        }

        return useThis || new RelationType(rel).isLiteral ? baseNodeRelatesToThisNode : thisNodeRelatesToBaseNode;
      }, false);
    });
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectNodes = (...args: any): NodeSelector => new NodeSelector(...args);
