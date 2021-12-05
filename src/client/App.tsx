/** @jsxFrag React.Fragment */
/** @jsx jsx */
// App
import React, { FC } from 'react';
import { css, jsx } from '@emotion/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Pages
import { connect } from 'react-redux';
import { routes, appName } from './config';
import transport from './lib/transport';
import { set } from './lib/LocalStorage';
import { store } from './lib/redux/store';
import { actionTypes } from './lib/redux/reducer';

// MUI
import { CssBaseline } from '@mui/material';

// Components
import { Header } from './components/Header';
import { SideMenu } from './components/SideMenu';
import { DataView } from './components/DataView';
import { InfoView } from './components/InfoView';
import { Loading } from './components/Loading';

store.subscribe(() => {
  const { user, ui } = store.getState();
  set(appName, { ui, user });
});

const mapStateToProps = (state) => {
  return {
    webSocketConnected: state.ui.ready.webSocket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setWebSocketConnected: () => dispatch({ type: actionTypes.READY_WEBSOCKET }),
  };
};

const styles = {
  root: css`
    display: flex;
  `,
  main: css`
    flex-grow: 1;
    height: 100vh;
  `,
  vignette: css`
    background: #222;
    box-shadow: inset 0 0 100px black;
    padding: 3em;
    min-height: 100vh;
  `,
  toolbar: css`
    min-height: 50px;
  `,
};

export const App: FC = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ setWebSocketConnected, webSocketConnected }) => {
  transport.on('open', () => {
    console.log('WebSocket Connected.');
    setWebSocketConnected();
  });

  window.transport = transport;

  return (
    <BrowserRouter>
      {webSocketConnected ? (
        <div css={styles.root}>
          <CssBaseline />
          <Header />
          <SideMenu />
          <DataView />
          <InfoView />
          <main css={styles.main}>
            <div css={styles.toolbar} />
            <div css={styles.vignette}>
              <Routes>
                {routes.map(({ path, component: Component }, index) => (
                  <Route key={index} path={path} element={<Component />} />
                ))}
              </Routes>
            </div>
          </main>
        </div>
      ) : (
        <Loading />
      )}
    </BrowserRouter>
  );
});
