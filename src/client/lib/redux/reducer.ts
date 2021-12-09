import { reducer as rootReducer, actionTypes as rootActionTypes } from '../../../shared/lib/redux/reducer';
import { action } from '../../../shared/all';
import { client } from '../../../shared/lib/redux/actionTypes';
import { initialState } from '../../config';

const debugReducer = true;

export const actionTypes = {
  ...rootActionTypes,
  CLOBBER_ENTITIES: 'CLOBBER_ENTITIES',
  SET_USERID: 'SET_USERID',
  SELECT_ENTITY: 'SELECT_ENTITY',
  DRAWER: 'DRAWER',
  READY_WEBSOCKET: 'READY_WEBSOCKET',
  DOCSTORE_SET_CURRENT_DOC: 'DOCSTORE_SET_CURRENT_DOC',
  NODE_REPLACE: 'NODE_REPLACE',
};

const clientReducer = (state = initialState, { type, payload }) => {
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

    case actionTypes.SET_USERID:
      return {
        ...state,
        user: {
          ...state.user,
          id: payload,
        },
      };

    case actionTypes.DRAWER:
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

    case actionTypes.READY_WEBSOCKET:
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

export const reducer = (state = initialState, action: action): any => {
  return rootReducer(clientReducer(state, action), action);
};
