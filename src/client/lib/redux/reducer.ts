import { reducer as rootReducer, actionTypes as rootActionTypes } from '../../../shared/lib/redux/reducer';
import { action } from '../../../shared/all';

export const initialState = {
  entities: [],
  nodes: [],
  documents: [],
  user: {
    id: null,
  },
  ui: {
    drawers: {
      info: false,
      data: false,
    },
    ready: {
      webSocket: false,
    },
    docStore: {
      currentDoc: {},
    },
    selectedEntityIndex: null,
    selectedEntityHistory: [],
  },
};

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

const clientReducer = (state, { type, payload }) => {
  const { entities } = state;
  switch (type) {
    case actionTypes.NODE_REPLACE:
      if (payload === undefined) throw new Error(`${type}: Payload is undefined`);
      const newNodes = payload instanceof Array ? payload : [payload];
      const nodeIds = newNodes.filter(({ _id }) => _id !== undefined).map(({ _id }) => _id);
      return {
        ...state,
        nodes: [...state.nodes.filter(({ _id }) => nodeIds.indexOf(_id) === -1), ...newNodes],
      };

    case actionTypes.DOCSTORE_UPDATE:

    case actionTypes.DOCSTORE_SET_CURRENT_DOC:
      return {
        ...state,
        ui: {
          ...state.ui,
          docStore: {
            ...state.ui.docStore,
            currentDoc: payload,
          },
        },
      };

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
  return state;
};

export const reducer = (state = initialState, action: action): any => {
  return rootReducer(clientReducer(state, action), action);
};
