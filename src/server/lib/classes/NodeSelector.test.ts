// @ts-nocheck
import { NodeSelector } from './NodeSelector';
import mongoose from 'mongoose';
import { getModelByName } from '../nodes/all';
import '../../config';
const { ObjectId } = mongoose.Types;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require('util');

const MessageModel = getModelByName('Message');
let rootNode, messages;

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

afterAll(async (done) => {
  // Closing the DB connection allows Jest to exit successfully.
  await mongoose.connection.close();
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
  beforeAll(async () => {
    rootNode = await new MessageModel({
      text: 'Favorite warrior?',
    }).save();
    await Promise.all(
      [
        {
          text: 'Sitting Bull',
          rel: {
            upstreams: [rootNode._id],
          },
        },
        {
          text: 'Crazy Horse',
          rel: {
            upstreams: [rootNode._id],
          },
        },
      ].map((data) => new MessageModel(data).save()),
    );
    messages = await MessageModel.find({});
  });

  test('Setup worked OK', async () => {
    expect(messages).toHaveLength(3);
    expect(messages[1].rel.upstreams.includes(rootNode._id)).toBeTruthy;
    expect(messages[2].rel.upstreams.includes(rootNode._id)).toBeTruthy;
  });

  test('Matching downstream nodes are filtered', async () => {
    const ns = new NodeSelector(rootNode._id).hasRelation('downstreams');
    const matchingNodes = await ns.filterMatchingNodes(messages);
    expect(matchingNodes).toHaveLength(2);
  });
});
