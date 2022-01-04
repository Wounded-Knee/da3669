import { client } from '../../../shared/lib/redux/actionTypes';
import { initialState } from '../../config';
import mongoose, { Types, ObjectId as ObjectIdType } from 'mongoose';
import { INodeAll } from '../../../shared/all';

const debug = {
  actions: false,
  noop: false,
  [client.STASH]: false,
};

const { ObjectId } = Types;

const objectifyNodeIds = (node) => {
  return {
    ...node,
    _id: new ObjectId(node._id),
    string_id: node._id,
    rel: node.rel
      ? Object.keys(node.rel).reduce(
          (rel, relationType) => ({
            ...rel,
            [relationType]: node.rel[relationType].map((relationId) => new ObjectId(relationId)),
          }),
          {},
        )
      : {},
  };
};

export const reducer = (state = initialState, { type, payload }) => {
  const reduxInit = type.indexOf('@@redux/INIT') !== -1;
  if (!reduxInit && debug.actions) {
    console.log(type, payload);
  }

  const getNodeById = (nodeId: ObjectIdType): INodeAll => {
    return state.nodes.find(({ _id }) => _id.toString() === nodeId.toString());
  };

  switch (type) {
    case client.SET_USER:
      return {
        ...state,
        ui: {
          ...state.ui,
          user: {
            ...state.ui.user,
            ...payload,
          },
        },
      };

    case client.SELECT_NODE:
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedNodeId: payload,
        },
      };

    case client.UPDATE_NET_WORTH:
      return {
        ...state,
        ui: {
          ...state.ui,
          user: {
            ...state.ui.user,
            netWorth: payload,
          },
        },
      };

    case client.STASH:
      if (payload === undefined) throw new Error(`${type}: Payload is undefined`);
      const newNodes = (payload instanceof Array ? payload : [payload])
        .map((node) => objectifyNodeIds(node))
        .filter(({ _id, updatedAt }) => {
          const oldNode = getNodeById(_id);
          return oldNode === undefined || updatedAt !== oldNode.updatedAt || oldNode.updatedAt === undefined;
        });
      if (newNodes.length) {
        if (debug[client.STASH]) console.log(client.STASH, payload);
        const nodeIds = newNodes.filter(({ _id }) => _id !== undefined).map(({ _id }) => _id.toString());
        return {
          ...state,
          nodes: [...state.nodes.filter(({ _id }) => nodeIds.indexOf(_id.toString()) === -1), ...newNodes],
        };
      } else {
        if (debug.noop) console.log('NOOP ', type, payload);
        return state;
      }

    case client.DRAWER:
      const [drawerName, open] = payload;
      return {
        ...state,
        ui: {
          ...state.ui,
          drawers: {
            ...state.ui.drawers,
            [drawerName]: open || !state.ui.drawers[drawerName],
          },
        },
      };

    case client.NOOP:
      return state;
  }
  if (!reduxInit) {
    console.error('Unhandled action type: ', type);
  }
  return state;
};
