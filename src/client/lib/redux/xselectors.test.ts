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

let baseNode, downstreamNode;
beforeAll(() => {
  baseNode = {
    _id: new mongoose.Types.ObjectId(),
    kind: 'Message',
    text: 'Fools Crow',
  };
  downstreamNode = {
    _id: new mongoose.Types.ObjectId(),
    kind: 'Message',
    text: 'Child of Fools Crow',
    rel: {
      upstreams: [baseNode._id],
    },
  };
  store.dispatch({
    type: client.STASH,
    payload: [baseNode, downstreamNode],
  });
});

test('Setup succeeded', () => {
  const nodes = store.getState().nodes;
  expect(nodes).toHaveLength(2);
  expect(nodes[0].text).toBe(baseNode.text);
});

test('Can get by ID', () => {
  const [node] = query(idQuery(baseNode._id));
  expect(node.text).toBe(baseNode.text);
});

test('Can get by lacked relation', () => {
  const [node] = query(lacksRelationQuery('upstreams'));
  expect(node.text).toBe(baseNode.text);
});

test('Can get by has relation', () => {
  const q = hasRelationQuery('upstreams');
  // console.log(inspect(q, { depth: null }));
  const [node] = query(q);
  expect(node.text).toBe(downstreamNode.text);
});

test('Can get relations of a given node', () => {
  const q = relationsOfQuery(baseNode._id, 'upstreams', 'authors');
  const nodes = query(q);
  expect(nodes[0].text).toBe(downstreamNode.text);
});

test('Can run a profile', () => {
  const profile = ['id', downstreamNode._id];
  const [node] = query(runProfile(profile));
  expect(node.text).toBe(downstreamNode.text);
});
