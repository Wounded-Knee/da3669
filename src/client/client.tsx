import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { Provider } from 'react-redux';
import { store } from './lib/redux/store';
import { Theme } from './components/Theme';
import { PassportProvider } from './components/PassportContext';

ReactDOM.render(
  <Provider store={store}>
    <Theme>
      <PassportProvider>
        <App />
      </PassportProvider>
    </Theme>
  </Provider>,
  document.getElementById('app'),
);
