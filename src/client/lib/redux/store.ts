import { createStore } from 'redux';
import { reducer as serverReducer } from './reducer';
import { initialState } from '../../config';

export const store = createStore(serverReducer, initialState);
