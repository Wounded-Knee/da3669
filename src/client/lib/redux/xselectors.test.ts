import sift from 'sift';
import { store } from './store';
import mongoose from 'mongoose';
import {
  id as idQuery,
  lacksRelation as lacksRelationQuery,
  hasRelation as hasRelationQuery,
  relationsOf as relationsOfQuery,
  runProfile,
} from '../../../shared/lib/selectorQueries';
import { client } from '../../../shared/lib/redux/actionTypes';
import { inspect } from 'util';

const query = (query) => store.getState().nodes.filter(sift(query));
const createMessage = (text, rel = {}) => ({
  _id: new mongoose.Types.ObjectId(),
  kind: 'Message',
  text,
  rel,
});

let blackElk, foolsCrow, wakanTanka;
beforeAll(() => {
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
  const [node] = query(idQuery(blackElk._id));
  expect(node.text).toBe(blackElk.text);
});

test('Can get by lacked relation', () => {
  const [node] = query(lacksRelationQuery('upstreams'));
  expect(node.text).toBe(blackElk.text);
});

test('Can get by has relation', () => {
  const q = hasRelationQuery('upstreams');
  // console.log(inspect(q, { depth: null }));
  const [node] = query(q);
  expect(node.text).toBe(foolsCrow.text);
});

test('Can get relations of a given node', () => {
  const q = relationsOfQuery(blackElk._id, 'upstreams', 'authors');
  const nodes = query(q);
  expect(nodes).toHaveLength(1);
  expect(nodes[0].text).toBe(foolsCrow.text);
});

test('Can run a profile', () => {
  const profile = ['id', foolsCrow._id];
  const [node] = query(runProfile(profile));
  expect(node.text).toBe(foolsCrow.text);
});
