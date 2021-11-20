import { reducer as rootReducer, actionTypes as rootActionTypes } from '../../../shared/lib/redux/reducer';
import { action } from '../../../shared/all';
import { initialState } from '../../config';

export const actionTypes = {
  ...rootActionTypes,
  CLOBBER_ENTITIES: 'CLOBBER_ENTITIES',
  SET_USERID: 'SET_USERID',
  SELECT_ENTITY: 'SELECT_ENTITY',
  DRAWER: 'DRAWER',
};

const clientReducer = (state, { type, payload }) => {
  const { entities } = state;
  switch (type) {
    case actionTypes.ADDED_ENTITY:
      const extantEntity = entities.find(({ id }) => id === payload.id);
      if (extantEntity) {
        if (extantEntity.date.updated === payload.date.updated) {
          // Cache is fresh; do nothing.
          console.log('noop');
          return state;
        } else {
          // Cache is stale; update entity.
          console.log('stale; updating');
          return {
            ...state,
            entities: [...entities.filter(({ id }) => id === payload.id), payload],
          };
        }
      } else {
        // Cache is clean; insert entity.
        console.log('clean; inserting');
        return {
          ...state,
          entities: [...entities, payload],
        };
      }
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
            [drawerName]: open || !state.ui.drawers[drawerName],
          },
        },
      };
  }
  return state;
};

export const reducer = (state = initialState, action: action): any => {
  return rootReducer(clientReducer(state, action), action);
};
