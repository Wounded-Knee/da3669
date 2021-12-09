import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer } from './reducer';

export const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

window.store = store;
