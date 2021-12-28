import mongoose from 'mongoose';
import { getModelByName } from './nodes/all';
import '../config';
import {
  id as idQuery,
  lacksRelation as lacksRelationQuery,
  hasRelation as hasRelationQuery,
  relationsOf as relationsOfQuery,
} from '../../shared/lib/selectorQueries';
import { inspect } from 'util';
import { relationsOf } from '../../shared/lib/selectorQueries';

const { ObjectId } = mongoose.Types;
const MessageModel = getModelByName('Message');
let baseNode, messages;
const query = async (query) => await MessageModel.find(query);

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
  const [node] = await query(idQuery(baseNode._id));
  expect(node.text).toBe('Favorite warrior?');
});

test('Can get by lacked relation', async () => {
  const [node] = await query(lacksRelationQuery('upstreams'));
  expect(node.text).toBe(baseNode.text);
});

test('Can get by has relation', async () => {
  const q = hasRelationQuery('upstreams');
  const [node] = await query(q);
  // console.log(inspect(node, { depth: null }), inspect(q, { depth: null }));
  expect(node.text).toBe(messages[1].text);
});

test('Can get relations of a given node', async () => {
  const q = relationsOfQuery(baseNode._id, 'upstreams', 'authors');
  const nodes = await query(q);
  expect(nodes).toHaveLength(2);
});
