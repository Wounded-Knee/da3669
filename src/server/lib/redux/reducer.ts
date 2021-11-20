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
      return {
        ...state,
        entities: [...state.entities, payload],
        nextId: payload.id + 1,
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
        id: getState().nextId,
      },
    };
    return new Promise((resolve) => {
      dispatch(action);
      resolve(action);
    });
  };
};

export const fetchEntity = (soughtId) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { entities } = getState();
      const action = {
        type: actionTypes.ADDED_ENTITY,
        payload: entities.find(({ id }) => id === soughtId),
      };
      console.log('Sending to client ', action);
      resolve(action);
    });
  };
};

export const reducer = (state = load() || initialState, action: action): any => {
  return rootReducer(serverReducer(state, action), action);
};
