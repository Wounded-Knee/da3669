/** @jsxFrag React.Fragment */
/** @jsx jsx */
// App
import React from 'react';
import { css, jsx } from '@emotion/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Pages
import { connect } from 'react-redux';
import { routes, appName } from './config';
import transport from './lib/transport';
import { set } from './lib/LocalStorage';
import { store } from './lib/redux/store';
import { actionTypes } from './lib/redux/reducer';

// MUI
import { CssBaseline, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

// Components
import { Header } from './components/Header';
import { SideMenu } from './components/SideMenu';
import { DataView } from './components/DataView';
import { InfoView } from './components/InfoView';
import { Loading } from './components/Loading';

declare module '@material-ui/core/styles' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    main: {
      flexGrow: 1,
      height: '100vh',
    },
    vignette: {
      boxShadow: 'inset 0 0 100px black',
      padding: '3em',
      minHeight: '100vh',
    },
    toolbar: {
      minHeight: 50,
    },
  }),
);

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

export const App = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ setWebSocketConnected, webSocketConnected }) => {
  const classes = useStyles({});

  transport.on('open', () => {
    console.log('WebSocket Connected.');
    setWebSocketConnected();
  });

  return (
    <BrowserRouter>
      {webSocketConnected ? (
        <div className={classes.root}>
          <CssBaseline />
          <Header />
          <SideMenu />
          <DataView />
          <InfoView />
          <main className={classes.main}>
            <div className={classes.toolbar} />
            <div className={classes.vignette}>
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
