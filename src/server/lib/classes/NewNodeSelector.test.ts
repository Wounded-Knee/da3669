import { NodeSelector } from './NodeSelector';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require('util');

describe('Query Generation', () => {
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
