import { reducer as rootReducer, actionTypes as rootActionTypes } from '../../../shared/lib/redux/reducer';
import { action } from '../../../shared/all';
import { initialState } from '../../config';

export const actionTypes = {
  ...rootActionTypes,
};

const serverReducer = (state, { type, payload }) => {
  switch (type) {
    case actionTypes.ADD_ENTITY:
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
      type: actionTypes.ADD_ENTITY,
      payload: {
        ...data,
        date: new Date(),
        id: getState().nextId + 1,
      },
    };
    return new Promise((resolve) => {
      dispatch(action);
      resolve(action);
    });
  };
};

export const reducer = (state = initialState, action: action): any => {
  return rootReducer(serverReducer(state, action), action);
};
