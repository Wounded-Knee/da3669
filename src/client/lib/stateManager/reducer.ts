import { reducer as rootReducer, actionTypes as rootActionTypes } from '../../../shared/lib/stateManager/reducer';
import { action } from '../../../shared/all';

export const actionTypes = {
  ...rootActionTypes,
  CLOBBER_ENTITIES: 'CLOBBER_ENTITIES',
  SET_USERID: 'SET_USERID',
  SELECT_ENTITY: 'SELECT_ENTITY',
  DRAWER: 'DRAWER',
};

const clientReducer = (state, { type, payload }) => {
  switch (type) {
    case actionTypes.CLOBBER_ENTITIES:
      return {
        ...state,
        entities: payload,
      };
    case actionTypes.SET_USERID:
      return {
        ...state,
        user: {
          ...state.user,
          id: payload,
        },
      };
    case actionTypes.SELECT_ENTITY:
      const history = state.ui.selectedEntityHistory.filter((id) => id !== payload);
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedEntityIndex: 0,
          selectedEntityHistory: [payload, ...history],
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
