// App
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; // Pages
import { connect } from 'react-redux';
import { core } from './core';

// MUI
import { CssBaseline, makeStyles } from '@material-ui/core';
import { createStyles, Theme, ThemeProvider, createTheme } from '@material-ui/core/styles';

// Components
import { Header } from './components/Header';
import { SideMenu } from './components/SideMenu';
import { View } from './wireframes/simple3/view';
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

const theme = createTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
  }),
);

const AppComponent = ({ webSocketConnected }) => {
  const classes = useStyles({});

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {webSocketConnected ? (
          <div className={classes.root}>
            <CssBaseline />
            <Header core={core} />
            <SideMenu core={core} />
            <DataView core={core} />
            <InfoView core={core} />
            <main className={classes.main}>
              <div className={classes.toolbar} />
              <Switch>
                <Route
                  path='/entity/:entityId'
                  render={({
                    match: {
                      params: { entityId },
                    },
                  }) => <View core={core} entityId={parseInt(entityId)} />}
                />
              </Switch>
            </main>
          </div>
        ) : (
          <Loading />
        )}
      </ThemeProvider>
    </BrowserRouter>
  );
};

const mapStateToProps = (state) => {
  return {
    webSocketConnected: state.ui.ready.webSocket,
  };
};

export const App = connect(mapStateToProps)(AppComponent);
