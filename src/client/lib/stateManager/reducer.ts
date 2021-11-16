import { reducer as rootReducer } from '../../../shared/lib/stateManager/reducer';
import { action } from '../../../shared/all';

const clientReducer = (state, { type, payload }) => {
  switch (type) {
    case 'CLOBBER_ENTITIES':
      return {
        ...state,
        entities: payload,
      };
    case 'SET_USERID':
      return {
        ...state,
        user: {
          ...state.user,
          id: payload,
        },
      };
    case 'SELECT_ENTITY':
      const history = state.ui.selectedEntityHistory.filter((id) => id !== payload);
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedEntityIndex: 0,
          selectedEntityHistory: [payload, ...history],
        },
      };
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
  }
  return state;
};

export const reducer = (state: any, action: action): any => {
  return rootReducer(clientReducer(state, action), action);
};
