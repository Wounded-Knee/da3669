import { client } from '../../../shared/lib/redux/actionTypes';
import { initialState } from '../../config';

const debugReducer = true;

export const reducer = (state = initialState, { type, payload }) => {
  const reduxInit = type.indexOf('@@redux/INIT') !== -1;
  if (!reduxInit && debugReducer) {
    console.log(type, payload);
  }
  switch (type) {
    case client.ABSORB_NODE:
      if (payload === undefined) throw new Error(`${type}: Payload is undefined`);
      const newNodes = (payload instanceof Array ? payload : [payload]).filter((newNode) => {
        const oldNode = state.nodes.find(({ _id }) => _id === newNode._id);
        return oldNode === undefined || newNode.updatedAt !== oldNode.updatedAt || oldNode.updatedAt === undefined;
      });
      if (newNodes.length) {
        const nodeIds = newNodes.filter(({ _id }) => _id !== undefined).map(({ _id }) => _id);
        if (debugReducer) console.log('Inserting ', nodeIds);
        return {
          ...state,
          nodes: [...state.nodes.filter(({ _id }) => nodeIds.indexOf(_id) === -1), ...newNodes],
        };
      } else {
        if (debugReducer) console.log('No new nodes remain, so, noop');
        return state;
      }

    case client.SET_USERID:
      return {
        ...state,
        user: {
          ...state.user,
          id: payload,
        },
      };

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

    case client.READY_WEBSOCKET:
      return {
        ...state,
        ui: {
          ...state.ui,
          ready: {
            ...state.ui.ready,
            webSocket: true,
          },
        },
      };
  }
  if (!reduxInit) {
    console.error('Unhandled action type: ', type);
  }
  return state;
};
