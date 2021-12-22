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

  async getNodes(): Promise<INodeAll[]> {
    const query = this.query;
    try {
      const nodes = await defaultModel.aggregate(query).exec();
      if (debug.getNodes) console.log('Nodes ', nodes, inspect(query, { depth: null }));
      return nodes;
    } catch (e) {
      console.error('Query Error ', inspect(query, { depth: null }), e);
      return [];
    }
  }

  async filterMatchingNodes(nodeArray: INodeAll[]): Promise<INodeAll[]> {
    const {
      cfg: { myRelations, me },
    } = this;

    if (!defaultModel) {
      console.error('DefaultModel Problem ', defaultModel);
      return [];
    }

    const myNodes = await Promise.all(
      me.map(async (myNodeId) => {
        try {
          const node = await defaultModel.findById(myNodeId).exec();
          if (debug.filterMatchingNodes) console.log('Map ', myNodeId, node);
          return node;
        } catch (e) {
          console.error('Problem finding myNodes ', myNodeId, me, e);
        }
      }),
    );
    if (debug.filterMatchingNodes) console.log('My Nodes ', myNodes);

    return nodeArray.filter((node) => {
      return Object.keys(myRelations).reduce((useThis: boolean, rel: string) => {
        if (myRelations[rel] === null) return useThis;

        const myRealRelations = myNodes.reduce((relations, myNode) => {
          return [...relations, ...(myNode.rel[new RelationType(rel).literal.plural] || [])];
        }, []);

        return useThis || new RelationType(rel).isLiteral
          ? myRealRelations.includes(node._id)
          : !!me.filter((value) => (node.rel[new RelationType(rel).literal.plural] || []).includes(value)).length;
      }, false);
    });
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectNodes = (...args: any): NodeSelector => new NodeSelector(...args);
