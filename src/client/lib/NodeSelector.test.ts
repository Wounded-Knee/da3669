import { NodeSelector } from './NodeSelector';
import { store } from './redux/store';
import { client } from '../../shared/lib/redux/actionTypes';
import mongoose from 'mongoose';

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
  expect(nodes[0].text).toBe('Fools Crow');
});

test('Can select base node alone.', () => {
  const ns = new NodeSelector(baseNode._id);
  expect(ns.nodes).toHaveLength(1);
  expect(ns.nodes[0].text).toBe('Fools Crow');
});

test('Can select downstreams.', () => {
  const ns = new NodeSelector(baseNode._id).populateRelation('downstreams');
  expect(ns.nodes).toHaveLength(1);
  expect(ns.nodes[0].text).toBe('Fools Crow');
});
