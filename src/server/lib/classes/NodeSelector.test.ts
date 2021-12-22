// @ts-nocheck
import { NodeSelector } from './NodeSelector';
import mongoose from 'mongoose';
import '../../config';
const { ObjectId } = mongoose.Types;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require('util');

beforeAll(
  async () =>
    await mongoose.connect(
      process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      },
    ),
);

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});

describe('Query Generation', () => {
  describe('Without base node', () => {
    describe('populateRelation()', () => {
      test('Single', () => {
        const ns = new NodeSelector().populateRelation('upstreams');
        expect(ns.query).toMatchSnapshot();
      });

      test('Multiple', () => {
        const ns = new NodeSelector().populateRelation('upstreams', 'authors');
        expect(ns.query).toMatchSnapshot();
      });

      test('All', () => {
        const ns = new NodeSelector().populateRelation();
        expect(ns.query).toMatchSnapshot();
      });
    });

    describe('hasRelation()', () => {
      test('Single', () => {
        const ns = new NodeSelector().hasRelation('upstreams');
        expect(ns.query).toMatchSnapshot();
      });

      test('Multiple', () => {
        const ns = new NodeSelector().hasRelation('upstreams', 'authors');
        expect(ns.query).toMatchSnapshot();
      });

      test('All', () => {
        const ns = new NodeSelector().hasRelation();
        expect(ns.query).toMatchSnapshot();
      });
    });

    describe('lacksRelation()', () => {
      test('Single', () => {
        const ns = new NodeSelector().lacksRelation('upstreams');
        expect(ns.query).toMatchSnapshot();
      });
    });
  });

  describe('With base node', () => {
    describe('populateRelation()', () => {
      test('Single', () => {
        const ns = new NodeSelector('61be22843bb15b2d14696c25').populateRelation('upstreams');
        expect(ns.query).toMatchSnapshot();
      });

      test('Multiple', () => {
        const ns = new NodeSelector('61be22843bb15b2d14696c25').populateRelation('upstreams', 'authors');
        expect(ns.query).toMatchSnapshot();
      });

      test('All', () => {
        const ns = new NodeSelector('61be22843bb15b2d14696c25').populateRelation();
        expect(ns.query).toMatchSnapshot();
      });
    });

    describe('hasRelation()', () => {
      test('Single', () => {
        const ns = new NodeSelector('61be22843bb15b2d14696c25').hasRelation('upstreams');
        expect(ns.query).toMatchSnapshot();
      });

      test('Multiple', () => {
        const ns = new NodeSelector('61be22843bb15b2d14696c25').hasRelation('upstreams', 'authors');
        expect(ns.query).toMatchSnapshot();
      });

      test('All', () => {
        const ns = new NodeSelector('61be22843bb15b2d14696c25').hasRelation();
        expect(ns.query).toMatchSnapshot();
      });
    });

    describe('lacksRelation()', () => {
      test('Single', () => {
        const ns = new NodeSelector('61be22843bb15b2d14696c25').lacksRelation('upstreams');
        expect(ns.query).toMatchSnapshot();
      });
    });
  });
});

describe('Node Matching', () => {
  test('Matching nodes are filtered', async () => {
    expect.assertions(0);
    const ns = new NodeSelector('61be23e15d55c9e5d68a2492').populateRelation('downstreams');
    const matchingNodes = await ns.filterMatchingNodes([
      {
        _id: new ObjectId('61be23585d55c9e5d68a247d'),
        text: 'Cookie',
        author: 'plugh',
        rel: {
          upstreams: [new ObjectId('61be23e15d55c9e5d68a2492')],
        },
      },
    ]);

    return matchingNodes;
  });
});
