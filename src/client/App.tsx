// App
import React from 'react';
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
    '@global': {
      '@keyframes color-change': {
        '0%': { color: 'rgba(255,0,0,1)' },
        '10%': { color: 'rgba(255,154,0,1)' },
        '20%': { color: 'rgba(208,222,33,1)' },
        '30%': { color: 'rgba(79,220,74,1)' },
        '40%': { color: 'rgba(63,218,216,1)' },
        '50%': { color: 'rgba(47,201,226,1)' },
        '60%': { color: 'rgba(28,127,238,1)' },
        '70%': { color: 'rgba(95,21,242,1)' },
        '80%': { color: 'rgba(186,12,248,1)' },
        '90%': { color: 'rgba(251,7,217,1)' },
        '100%': { color: 'rgba(255,0,0,1)' },
      },

      '@keyframes background-color-change': {
        '0%': { backgroundColor: 'rgba(255,0,0,1)' },
        '10%': { backgroundColor: 'rgba(255,154,0,1)' },
        '20%': { backgroundColor: 'rgba(208,222,33,1)' },
        '30%': { backgroundColor: 'rgba(79,220,74,1)' },
        '40%': { backgroundColor: 'rgba(63,218,216,1)' },
        '50%': { backgroundColor: 'rgba(47,201,226,1)' },
        '60%': { backgroundColor: 'rgba(28,127,238,1)' },
        '70%': { backgroundColor: 'rgba(95,21,242,1)' },
        '80%': { backgroundColor: 'rgba(186,12,248,1)' },
        '90%': { backgroundColor: 'rgba(251,7,217,1)' },
        '100%': { backgroundColor: 'rgba(255,0,0,1)' },
      },
    },
    root: {
      display: 'flex',
    },
    main: {
      flexGrow: 1,
      height: '100vh',
    },
    toolbar: theme.mixins.toolbar,
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
            <Routes>
              {routes.map(({ path, component: Component }, index) => (
                <Route key={index} path={path} element={<Component />} />
              ))}
            </Routes>
          </main>
        </div>
      ) : (
        <Loading />
      )}
    </BrowserRouter>
  );
});
