import { client } from '../../../shared/lib/redux/actionTypes';
import { initialState } from '../../config';

const debug = {
  actions: false,
  noop: true,
};

export const reducer = (state = initialState, { type, payload }) => {
  const reduxInit = type.indexOf('@@redux/INIT') !== -1;
  if (!reduxInit && debug.actions) {
    console.log(type, payload);
  }
  switch (type) {
    case client.ABSORB_NODES:
      if (payload === undefined) throw new Error(`${type}: Payload is undefined`);
      const newNodes = (payload instanceof Array ? payload : [payload]).filter((newNode) => {
        const oldNode = state.nodes.find(({ _id }) => _id === newNode._id);
        return oldNode === undefined || newNode.updatedAt !== oldNode.updatedAt || oldNode.updatedAt === undefined;
      });
      if (newNodes.length) {
        const nodeIds = newNodes.filter(({ _id }) => _id !== undefined).map(({ _id }) => _id);
        return {
          ...state,
          nodes: [...state.nodes.filter(({ _id }) => nodeIds.indexOf(_id) === -1), ...newNodes],
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
