import { reducer as rootReducer, actionTypes as rootActionTypes } from '../../../shared/lib/redux/reducer';
import { action } from '../../../shared/all';
import { initialState } from '../../config';

export const actionTypes = {
  ...rootActionTypes,
  DO_SERVER_STUFF: 'DO_SERVER_STUFF',
};

const serverReducer = (state, { type, payload }) => {
  switch (type) {
    case actionTypes.DO_SERVER_STUFF:
      console.log('Doing server stuff');
      return state;
    case actionTypes.ADD_ENTITY:
      return {
        ...state,
        nextId: state.nextId + 1,
      };
  }
  return state;
};

export const reducer = (state = initialState, action: action): any => {
  return rootReducer(serverReducer(state, action), action);
};
