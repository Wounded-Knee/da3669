import { NodeId } from '../../../shared/all';
import { INodeAll, relationTypes, RelationTypes } from '../../../shared/nodes/all';
import { defaultNodeType } from '../nodes/all';
import mongoose from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require('util');

mongoose.connect('fuck-you').then(() => {
  console.log('MongoDB Connected.');
});

const flatRelationTypes = relationTypes.flat(2).filter((relationType) => RelationTypes(relationType).isPlural);
const { model: DefaultModel } = defaultNodeType;
const { ObjectId } = mongoose.Types;

interface INodeSelectorCfg {
  me: NodeId[];
  myRelations: {
    [key: string]: boolean | null;
  };
}

class NodeSelector {
  cfg = <INodeSelectorCfg>{
    me: [],
    myRelations: {},
  };
  // Populate
  //

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

  match(nodeList: INodeAll[]) {}

  get query() {
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

  async get() {
    const query = this.query;
    return await DefaultModel.aggregate(query).exec();
  }
}

describe('Query Generation', () => {
  describe('populateRelation()', () => {
    test('Single', async () => {
      const ns = new NodeSelector().populateRelation('upstreams');
      expect(JSON.stringify(ns.query)).toBe(
        JSON.stringify([
          {
            $lookup: {
              from: 'bases',
              localField: 'rel.upstreams',
              foreignField: '_id',
              as: 'rel.upstreams',
            },
          },
        ]),
      );
    });

    test('Multiple', async () => {
      const ns = new NodeSelector().populateRelation('upstreams', 'authors');
      expect(JSON.stringify(ns.query)).toBe(
        JSON.stringify([
          {
            $lookup: {
              from: 'bases',
              localField: 'rel.upstreams',
              foreignField: '_id',
              as: 'rel.upstreams',
            },
          },
          {
            $lookup: {
              from: 'bases',
              localField: 'rel.authors',
              foreignField: '_id',
              as: 'rel.authors',
            },
          },
        ]),
      );
    });

    test('All', async () => {
      const ns = new NodeSelector().populateRelation();
      expect(JSON.stringify(ns.query)).toBe(
        JSON.stringify([
          {
            $lookup: {
              from: 'bases',
              localField: 'rel.upstreams',
              foreignField: '_id',
              as: 'rel.upstreams',
            },
          },
          {
            $lookup: {
              from: 'bases',
              localField: '_id',
              foreignField: 'rel.upstreams',
              as: 'rel.downstreams',
            },
          },
          {
            $lookup: {
              from: 'bases',
              localField: 'rel.children',
              foreignField: '_id',
              as: 'rel.children',
            },
          },
          {
            $lookup: {
              from: 'bases',
              localField: '_id',
              foreignField: 'rel.children',
              as: 'rel.parents',
            },
          },
          {
            $lookup: {
              from: 'bases',
              localField: 'rel.authors',
              foreignField: '_id',
              as: 'rel.authors',
            },
          },
          {
            $lookup: {
              from: 'bases',
              localField: '_id',
              foreignField: 'rel.authors',
              as: 'rel.works',
            },
          },
        ]),
      );
    });
  });

  describe('hasRelation()', () => {
    test('Single', async () => {
      const ns = new NodeSelector().hasRelation('upstreams');
      expect(JSON.stringify(ns.query)).toBe(
        JSON.stringify([
          {
            $match: { 'rel.upstreams': { $not: { $size: 0 } } },
          },
        ]),
      );
    });

    test('Multiple', async () => {
      const ns = new NodeSelector().hasRelation('upstreams', 'authors');
      expect(JSON.stringify(ns.query)).toBe(
        JSON.stringify([
          {
            $match: {
              'rel.upstreams': { $not: { $size: 0 } },
              'rel.authors': { $not: { $size: 0 } },
            },
          },
        ]),
      );
    });

    test('All', async () => {
      const ns = new NodeSelector().hasRelation();
      expect(JSON.stringify(ns.query)).toBe(
        JSON.stringify([
          {
            $match: {
              'rel.upstreams': { $not: { $size: 0 } },
              'rel.children': { $not: { $size: 0 } },
              'rel.authors': { $not: { $size: 0 } },
            },
          },
        ]),
      );
    });
  });

  describe('lacksRelation()', () => {
    test('Single', async () => {
      const ns = new NodeSelector().lacksRelation('upstreams');
      expect(JSON.stringify(ns.query)).toBe(
        JSON.stringify([
          {
            $match: {
              'rel.upstreams': { $size: 0 },
            },
          },
        ]),
      );
    });
  });
});
