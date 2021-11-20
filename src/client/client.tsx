import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { CoreTest } from './CoreTest';
import { Provider } from 'react-redux';
import { store } from './lib/redux/store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);
