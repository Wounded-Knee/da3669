import { NodeSelector } from './NodeSelector';
import mongoose from 'mongoose';
import mockingoose from 'mockingoose';
const { ObjectId } = mongoose.Types;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require('util');

beforeAll(
  () =>
    new Promise((resolve, reject) => {
      mongoose
        .connect(
          'mongodb+srv://DA3669-pw:wmX7v7AedZXBEBS@da3669.tgcx8.mongodb.net/development?retryWrites=true&w=majority',
        )
        .then(resolve)
        .catch(reject);
    }),
);

describe('Query Generation', () => {
  describe('Without base node', () => {
    describe('populateRelation()', () => {
      test('Single', () => {
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

      test('Multiple', () => {
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

      test('All', () => {
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
      test('Single', () => {
        const ns = new NodeSelector().hasRelation('upstreams');
        expect(JSON.stringify(ns.query)).toBe(
          JSON.stringify([
            {
              $match: { 'rel.upstreams': { $not: { $size: 0 } } },
            },
          ]),
        );
      });

      test('Multiple', () => {
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

      test('All', () => {
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
      test('Single', () => {
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

  describe('With base node', () => {
    describe('populateRelation()', () => {
      test('Single', () => {
        const ns = new NodeSelector('xyzzy').populateRelation('upstreams');
        expect(JSON.stringify(ns.query)).toBe(
          JSON.stringify([
            { $match: { _id: ['xyzzy'] } },
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

      test('Multiple', () => {
        const ns = new NodeSelector('xyzzy').populateRelation('upstreams', 'authors');
        expect(JSON.stringify(ns.query)).toBe(
          JSON.stringify([
            { $match: { _id: ['xyzzy'] } },
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

      test('All', () => {
        const ns = new NodeSelector('xyzzy').populateRelation();
        expect(JSON.stringify(ns.query)).toBe(
          JSON.stringify([
            { $match: { _id: ['xyzzy'] } },
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
      test('Single', () => {
        const ns = new NodeSelector('xyzzy').hasRelation('upstreams');
        expect(JSON.stringify(ns.query)).toBe(
          JSON.stringify([
            {
              $match: { _id: ['xyzzy'], 'rel.upstreams': { $not: { $size: 0 } } },
            },
          ]),
        );
      });

      test('Multiple', () => {
        const ns = new NodeSelector('xyzzy').hasRelation('upstreams', 'authors');
        expect(JSON.stringify(ns.query)).toBe(
          JSON.stringify([
            {
              $match: {
                _id: ['xyzzy'],
                'rel.upstreams': { $not: { $size: 0 } },
                'rel.authors': { $not: { $size: 0 } },
              },
            },
          ]),
        );
      });

      test('All', () => {
        const ns = new NodeSelector('xyzzy').hasRelation();
        expect(JSON.stringify(ns.query)).toBe(
          JSON.stringify([
            {
              $match: {
                _id: ['xyzzy'],
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
      test('Single', () => {
        const ns = new NodeSelector('xyzzy').lacksRelation('upstreams');
        expect(JSON.stringify(ns.query)).toBe(
          JSON.stringify([
            {
              $match: {
                _id: ['xyzzy'],
                'rel.upstreams': { $size: 0 },
              },
            },
          ]),
        );
      });
    });
  });
});

describe('Node Matching', () => {
  test('Matching nodes are filtered', async () => {
    const ns = new NodeSelector('61be23e15d55c9e5d68a2492').lacksRelation('upstreams');
    console.log(
      await ns.filterMatchingNodes([
        {
          _id: new ObjectId('61be23585d55c9e5d68a247d'),
          text: 'Cookie',
          author: 'plugh',
          rel: {},
        },
      ]),
    );
  });
});
