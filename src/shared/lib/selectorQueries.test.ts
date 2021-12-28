import sift from 'sift';
import mongoose from 'mongoose';
import {
  id as idQuery,
  lacksRelation as lacksRelationQuery,
  hasRelation as hasRelationQuery,
  relationsOf as relationsOfQuery,
  runProfile,
} from './selectorQueries';
import { client } from './redux/actionTypes';
import { inspect } from 'util';
import { store } from '../../client/lib/redux/store';
import { getModelByName } from '../../server/lib/nodes/all';

const { ObjectId } = mongoose.Types;
const MessageModel = getModelByName('Message');
const queryDb = async (query) => await MessageModel.find(query);
const queryStore = (query) => store.getState().nodes.filter(sift(query));

describe('Mongo Database Selections', () => {
  let baseNode, messages;
  beforeAll(async () => {
    // @ts-ignore
    await mongoose.connect(process.env.MONGO_URL, {}, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });

    baseNode = await new MessageModel({
      text: 'Favorite warrior?',
      rel: {
        authors: [new ObjectId()],
      },
    }).save();
    await Promise.all(
      [
        {
          text: 'Sitting Bull',
          rel: {
            upstreams: [baseNode._id],
          },
        },
        {
          text: 'Crazy Horse',
          rel: {
            upstreams: [baseNode._id],
          },
        },
      ].map((data) => new MessageModel(data).save()),
    );
    messages = await MessageModel.find({});
  });

  afterAll(async (done) => {
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.connection.close();
    done();
  });

  test('Setup worked OK', async () => {
    expect(messages).toHaveLength(3);
    expect(messages[1].rel.upstreams.includes(baseNode._id)).toBeTruthy;
    expect(messages[2].rel.upstreams.includes(baseNode._id)).toBeTruthy;
  });

  test('Can get by ID', async () => {
    const [node] = await queryDb(idQuery(baseNode._id));
    expect(node.text).toBe('Favorite warrior?');
  });

  test('Can get by lacked relation', async () => {
    const [node] = await queryDb(lacksRelationQuery('upstreams'));
    expect(node.text).toBe(baseNode.text);
  });

  test('Can get by has relation', async () => {
    const q = hasRelationQuery('upstreams');
    const [node] = await queryDb(q);
    // console.log(inspect(node, { depth: null }), inspect(q, { depth: null }));
    expect(node.text).toBe(messages[1].text);
  });

  test('Can get relations of a given node', async () => {
    const q = relationsOfQuery(baseNode._id, 'upstreams', 'authors');
    const nodes = await queryDb(q);
    expect(nodes).toHaveLength(2);
  });
});

describe('Local store selections', () => {
  let blackElk, foolsCrow, wakanTanka;
  beforeAll(() => {
    const createMessage = (text, rel = {}) => ({
      _id: new mongoose.Types.ObjectId(),
      kind: 'Message',
      text,
      rel,
    });

    wakanTanka = createMessage('Wakan Tanka');
    blackElk = createMessage('Black Elk', { authors: [wakanTanka._id] });
    foolsCrow = createMessage('Fools Crow', {
      upstreams: [blackElk._id],
      authors: [wakanTanka._id],
    });

    store.dispatch({
      type: client.STASH,
      payload: [blackElk, foolsCrow, wakanTanka],
    });
  });

  test('Setup succeeded', () => {
    const nodes = store.getState().nodes;
    expect(nodes).toHaveLength(3);
    expect(nodes[0].text).toBe(blackElk.text);
  });

  test('Can get by ID', () => {
    const [node] = queryStore(idQuery(blackElk._id));
    expect(node.text).toBe(blackElk.text);
  });

  test('Can get by lacked relation', () => {
    const [node] = queryStore(lacksRelationQuery('upstreams'));
    expect(node.text).toBe(blackElk.text);
  });

  test('Can get by has relation', () => {
    const q = hasRelationQuery('upstreams');
    // console.log(inspect(q, { depth: null }));
    const [node] = queryStore(q);
    expect(node.text).toBe(foolsCrow.text);
  });

  test('Can get relations of a given node', () => {
    const q = relationsOfQuery(blackElk._id, 'upstreams', 'authors');
    const nodes = queryStore(q);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].text).toBe(foolsCrow.text);
  });

  test('Can run a profile', () => {
    const profile = ['id', foolsCrow._id];
    const [node] = queryStore(runProfile(profile));
    expect(node.text).toBe(foolsCrow.text);
  });
});
