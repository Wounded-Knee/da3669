import { reducer as rootReducer, actionTypes as rootActionTypes } from '../../../shared/lib/stateManager/reducer';
import { action } from '../../../shared/all';
import { sliceName } from '../../config';

const unscopedActionTypes = {
  ...rootActionTypes,
  DO_SERVER_STUFF: 'DO_SERVER_STUFF',
};

export const actionTypes: { [key: string]: string } = Object.keys(unscopedActionTypes).reduce(
  (scopedActionTypes, actionType) => ({
    ...scopedActionTypes,
    [actionType]: `${sliceName}/${unscopedActionTypes[actionType]}`,
  }),
  {},
);

const serverReducer = (state, { type, payload }) => {
  switch (type) {
    case actionTypes.DO_SERVER_STUFF:
      console.log('Doing server stuff');
      return state;
  }
  return state;
};

export const reducer = (state: any, action: action): any => {
  return rootReducer(serverReducer(state, action), action);
};
