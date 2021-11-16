import { createSlice, configureStore } from '@reduxjs/toolkit';
import { dispatch } from '../../../shared/all';
import { initialState } from './initialState';
import { reducer } from './reducer';

/*
const reducers = Object.keys(actionTypes).reduce((reducers, actionType) => {
  return {
    ...reducers,
    [actionTypes[actionType]]: (state, action) => reducer(action.type)
  }
}, {});
*/

const slice = createSlice({
  name: 'D3 Server Slice',
  initialState,
  reducers: {
    general: reducer,
  },
});

const store = configureStore({
  reducer: slice.reducer,
});

/*
  slice: {
    actions: {
      [actionName](payload) {} // Creates an action object
    }
  }

  store: {
    subscribe(callback) {} // Subscribes to state updates
    dispatch(slice.actions[n](payload)) {} // Dispatches an action
  }
*/

export const stateManager = (): [any, dispatch] => {
  return [store, store.dispatch.bind(store)];
};
