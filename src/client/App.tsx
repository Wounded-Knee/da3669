// App
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Pages
import { connect } from 'react-redux';
import { core } from './core';

// MUI
import { CssBaseline, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

// Components
import { Header } from './components/Header';
import { SideMenu } from './components/SideMenu';
import { View } from './wireframes/simple3/view';
import { DataView } from './components/DataView';
import { InfoView } from './components/InfoView';
import { Loading } from './components/Loading';
import DocStore from './wireframes/docstore/DocStore';

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
    toolbar: theme.mixins.toolbar,
  }),
);

const mapStateToProps = (state) => {
  return {
    webSocketConnected: state.ui.ready.webSocket,
  };
};

export const App = connect(mapStateToProps)(({ webSocketConnected }) => {
  const classes = useStyles({});

  return (
    <BrowserRouter>
      {webSocketConnected ? (
        <div className={classes.root}>
          <CssBaseline />
          <Header core={core} />
          <SideMenu core={core} />
          <DataView core={core} />
          <InfoView core={core} />
          <main className={classes.main}>
            <div className={classes.toolbar} />
            <Routes>
              <Route path='/:entityId' element={<View />} />
              <Route path='/docstore' element={<DocStore />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Loading />
      )}
    </BrowserRouter>
  );
});
