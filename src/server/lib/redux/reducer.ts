import { reducer as rootReducer, actionTypes as rootActionTypes } from '../../../shared/lib/redux/reducer';
import { action } from '../../../shared/all';
import { initialState } from '../../config';
import { load } from '../persist';

export const actionTypes = {
  ...rootActionTypes,
};

const serverReducer = (state, { type, payload }) => {
  switch (type) {
    case actionTypes.ADDED_ENTITY:
      // Shared reducer adds the entity, server reducer increments ID.
      return {
        ...state,
        nextId: state.nextId + 1,
      };
  }
  return state;
};

export const addEntity = (data) => {
  return (dispatch, getState) => {
    const action = {
      type: actionTypes.ADDED_ENTITY,
      payload: {
        ...data,
        date: {
          created: new Date(),
          updated: new Date(),
        },
        id: getState().nextId + 1,
      },
    };
    return new Promise((resolve) => {
      dispatch(action);
      resolve(action);
    });
  };
};

export const reducer = (state = load() || initialState, action: action): any => {
  return rootReducer(serverReducer(state, action), action);
};
