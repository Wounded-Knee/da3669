import sift from 'sift';
import mongoose from 'mongoose';
import {
  id as idQuery,
  lacksRelation as lacksRelationQuery,
  hasRelation as hasRelationQuery,
  relationsOf as relationsOfQuery,
  getQueryByProfile,
} from './selectorQueries';
import { client } from './redux/actionTypes';
import { inspect } from 'util';
import { store } from '../../client/lib/redux/store';
import { getModelByName } from '../../server/lib/nodes/all';

const { ObjectId } = mongoose.Types;
const MessageModel = getModelByName('Message');
const queryDb = async (query) => await MessageModel.find(query);
const queryStore = (query) => store.getState().nodes.filter(sift(query));

let wakanTanka, sittingBull, crazyHorse, blackElk, foolsCrow, messages;
beforeAll(async () => {
  // @ts-ignore
  await mongoose.connect(process.env.MONGO_URL, {}, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });

  wakanTanka = await new MessageModel({
    text: 'Wakȟáŋ Tȟáŋka',
  }).save();
  sittingBull = await new MessageModel({
    text: 'Tȟatȟáŋka Íyotake',
    rel: {
      authors: [wakanTanka._id],
    },
  }).save();
  crazyHorse = await new MessageModel({
    text: 'Tȟašúŋke Witkó',
    rel: {
      authors: [wakanTanka._id],
    },
  }).save();
  blackElk = await new MessageModel({
    text: 'Heȟáka Sápa',
    rel: {
      authors: [wakanTanka._id],
      upstreams: [crazyHorse._id],
    },
  }).save();
  foolsCrow = await new MessageModel({
    text: 'Fools Crow',
    rel: {
      authors: [wakanTanka._id],
      upstreams: [blackElk._id],
    },
  }).save();
  messages = await MessageModel.find({}).lean();
  store.dispatch({
    type: client.STASH,
    payload: messages,
  });
});

afterAll(async (done) => {
  // Closing the DB connection allows Jest to exit successfully.
  await mongoose.connection.close();
  done();
});

describe('Mongo Database Selections', () => {
  test('Setup worked OK', async () => {
    const nodes = store.getState().nodes;
    const nodesAreMongoDocs = nodes.reduce((verdict, { $__ }) => verdict && !$__, true);
    expect(nodes).toHaveLength(5);
    expect(nodesAreMongoDocs).toBeTruthy();

    expect(messages).toHaveLength(5);
    expect(messages[1].rel.authors.includes(wakanTanka._id)).toBeTruthy;
    expect(messages[2].rel.authors.includes(wakanTanka._id)).toBeTruthy;
  });

  test('Can get by ID', async () => {
    const [dbNode] = await queryDb(idQuery(wakanTanka._id));
    expect(dbNode.text).toBe(wakanTanka.text);

    const [storeNode] = queryStore(idQuery(wakanTanka._id));
    console.log(storeNode);
    expect(storeNode.text).toBe(wakanTanka.text);
  });

  test('Can get by lacked relation', async () => {
    const nodes = await queryDb(lacksRelationQuery('upstreams'));
    expect(nodes).toHaveLength(3);
    expect(nodes[0].text).toBe(wakanTanka.text);

    const [storeNode] = queryStore(lacksRelationQuery('upstreams'));
    expect(storeNode.text).toBe(wakanTanka.text);
  });

  test('Can get by has relation', async () => {
    const q = hasRelationQuery('upstreams');
    const nodes = await queryDb(q);
    expect(nodes).toHaveLength(2);
    expect(nodes[0].text).toBe(blackElk.text);
    expect(nodes[1].text).toBe(foolsCrow.text);

    const storeNodes = queryStore(q);
    expect(storeNodes).toHaveLength(2);
    expect(storeNodes[0].text).toBe(blackElk.text);
    expect(storeNodes[1].text).toBe(foolsCrow.text);
  });

  test('Can get relations of a given node', async () => {
    // Wakan Tanka has no upstreams and no authors
    const q = relationsOfQuery(wakanTanka._id, 'upstreams', 'authors');
    const nodes = await queryDb(q);
    expect(nodes).toHaveLength(0);

    const storeNodes = queryStore(q);
    expect(storeNodes).toHaveLength(0);
  });
});

describe('Query Profiles', () => {
  test('Can run a profile', () => {
    const profile = ['id', foolsCrow._id];
    const [node] = queryStore(getQueryByProfile(profile));
    expect(node.text).toBe(foolsCrow.text);
  });

  test('Rejects invalid profiles', () => {
    [
      ['id', undefined],
      ['invalidMethodName', '123'],
      ['hasRelation', undefined],
    ].forEach((profile) => {
      const query = getQueryByProfile(profile);
      const nodes = queryStore(query);
      expect(query).toBeFalsy();
      expect(nodes).toHaveLength(0);
    });
  });
});
