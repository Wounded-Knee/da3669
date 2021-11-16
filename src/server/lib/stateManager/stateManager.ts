import { createSlice, configureStore } from '@reduxjs/toolkit';
import { dispatch } from '../../../shared/all';
import { initialState } from './initialState';
import { reducer as serverReducer } from './reducer';
import { sliceName } from '../../config';

const { reducer, actions } = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    debugg(state, action) {
      console.log('bugg');
      return state;
    },
    debug: (state, action) => {
      console.log('Dispatch ', action);
      return state;
    },
    DO_SERVER_STUFF: serverReducer,
  },
});

console.log(actions.DO_SERVER_STUFF(0));

const store = configureStore({ reducer });
store.subscribe((...args) => console.log('SUBSCRIBE ', store.getState(), ...args));

export const stateManager = (): [any, dispatch] => {
  return [store, ({ type, ...other }) => store.dispatch({ type: `${sliceName}/${type}`, ...other })];
};
