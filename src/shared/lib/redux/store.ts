import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

export const getStore = (reducer) => {
  return createStore(reducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));
};
