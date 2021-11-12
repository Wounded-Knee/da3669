import React, { useState, createContext } from 'react';
import { store } from '../ReduxStore';

const ReduxContext = createContext(store.getState());

function ReduxProvider(props) {
  return <ReduxContext.Provider value={store.getState()}>{props.children}</ReduxContext.Provider>;
}

export { ReduxContext, ReduxProvider };
