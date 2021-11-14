import { useReducer } from 'react';
import { data as staticEntities } from '../wireframes/simple3/data';

const initialState = {
  entities: staticEntities,
  user: {
    id: null,
  },
  ui: {
    drawers: {
      info: false,
      data: false,
    },
    selectedEntityIndex: null,
    selectedEntityHistory: [],
  },
};

const stateReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SELECT_ENTITY':
      return state.ui.selectedEntityHistory.indexOf(payload) === -1
        ? {
            ...state,
            ui: {
              ...state.ui,
              selectedEntityIndex: 0,
              selectedEntityHistory: [payload, ...state.ui.selectedEntityHistory],
            },
          }
        : state;
    case 'ADD_ENTITY':
      return {
        ...state,
        entities: [...state.entities, payload],
      };
      break;
    case 'DRAWER':
      const [drawerName, open] = payload;
      return {
        ...state,
        ui: {
          ...state.ui,
          drawers: {
            ...state.ui.drawers,
            [drawerName]: open,
          },
        },
      };
      break;
    default:
      throw new Error(`Unrecognized action type ${type} to state reducer.`);
      break;
  }
};

export const stateManager = () => useReducer(stateReducer, initialState);
