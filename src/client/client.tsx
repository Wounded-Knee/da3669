import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { Provider } from 'react-redux';
import { store } from './lib/redux/store';
import { Theme } from './components/Theme';
import { Passport } from './components/Passport';

ReactDOM.render(
  <Provider store={store}>
    <Theme>
      <Passport>
        <App />
      </Passport>
    </Theme>
  </Provider>,
  document.getElementById('app'),
);
