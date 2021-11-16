import { createStore } from 'redux';
import { dispatch } from '../../../shared/all';
import { reducer as serverReducer } from './reducer';
import { initialState } from '../../config';

const store = createStore(serverReducer, initialState);
store.subscribe((...args) => console.log('SUBSCRIBE ', store.getState(), ...args));

export const stateManager = (): [any, dispatch] => {
  return [store, store.dispatch];
};
