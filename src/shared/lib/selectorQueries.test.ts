import { sift } from './sift.aggregate';
import mongoose from 'mongoose';
import {
  id as idQuery,
  ids as idsQuery,
  lacksRelation as lacksRelationQuery,
  hasRelation as hasRelationQuery,
  relationsOf as relationsOfQuery,
  getOperationByProfile,
} from './selectorQueries';
import { client } from './redux/actionTypes';
import { inspect } from 'util';
import { store } from '../../client/lib/redux/store';
import { getModelByName } from '../../server/lib/nodes/all';
import { IMongoOperation } from '../all';

const { ObjectId } = mongoose.Types;
const MessageModel = getModelByName('Message');
const queryDb = async (operation: IMongoOperation) => {
  if (typeof operation !== 'boolean') {
    if (operation.find) {
      return await MessageModel.find(operation.find);
    } else if (operation.aggregate) {
      // @ts-ignore
      const result = await MessageModel.aggregate(operation.aggregate);
      return result[0].relatives;
    }
  }
};
const queryStore = (operation: IMongoOperation) => {
  if (typeof operation !== 'boolean') {
    if (operation.client) {
      return operation.client(store.getState().nodes);
    } else if (operation.find) {
      return store.getState().nodes.filter(sift(operation.find));
    } else if (operation.aggregate) {
      // @ts-ignore
      return store.getState().nodes.filter(sift.aggregate(operation.aggregate));
    }
  }
};

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

describe('DB/Store Selections', () => {
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
    expect(storeNode.text).toBe(wakanTanka.text);
  });

  test('Can get by IDs', async () => {
    const dbNodes = await queryDb(idsQuery(crazyHorse._id, sittingBull._id));
    expect(dbNodes).toHaveLength(2);

    const storeNodes = queryStore(idsQuery(crazyHorse._id, sittingBull._id));
    expect(storeNodes).toHaveLength(2);
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

    // Black Elk has one upstream; Crazy Horse.
    const q2 = relationsOfQuery(blackElk._id, 'upstreams');
    const nodes2 = await queryDb(q2);
    expect(nodes2).toHaveLength(1);
    expect(nodes2[0].text).toBe(crazyHorse.text);

    const storeNodes2 = queryStore(q2);
    expect(storeNodes2).toHaveLength(1);
    expect(storeNodes2[0].text).toBe(crazyHorse.text);
  });
});

describe('Query Profiles', () => {
  test('Can run a profile', () => {
    const profile = ['id', foolsCrow._id];
    const query = getOperationByProfile(profile);
    const [node] = typeof query !== 'boolean' && queryStore(query);
    expect(node.text).toBe(foolsCrow.text);
  });

  test('Rejects invalid profiles', () => {
    [
      ['id', undefined],
      ['invalidMethodName', '123'],
      ['hasRelation', undefined],
    ].forEach((profile) => {
      const query = getOperationByProfile(profile);
      expect(query).toBeFalsy();
    });
  });

  test('Allows valid profiles', () => {
    [['id', '61c271466ca1f2ccd97fd13d']].forEach((profile) => {
      const query = getOperationByProfile(profile);
      expect(query).toBeTruthy();
    });
  });

  test('getOperationByProfile', () => {
    [
      ['id', crazyHorse._id],
      ['relationsOf', blackElk._id, 'upstreams'],
      ['relationsOf', blackElk._id, 'authors'],
    ].forEach((profile) => {
      const operation = getOperationByProfile(profile);
      expect(typeof operation).not.toBe('boolean');
      if (typeof operation !== 'boolean') {
        const nodes = queryStore(operation);
        expect(nodes).toHaveLength(1);
      }
    });
  });
});
