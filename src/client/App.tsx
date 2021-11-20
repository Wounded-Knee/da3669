// App
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; // Pages
import { store } from './lib/redux/store';
import { Provider } from 'react-redux';

// Config
import { WS_SERVER_HOST, WS_SERVER_PORT } from './config';

// MUI
import { CssBaseline, makeStyles } from '@material-ui/core';
import { createStyles, Theme, ThemeProvider, createTheme } from '@material-ui/core/styles';

// Components
import { Header } from './components/Header';
import { SideMenu } from './components/SideMenu';
import { View } from './wireframes/simple3/view';
import { DataView } from './components/DataView';
import { InfoView } from './components/InfoView';

// Core
import { Core } from './lib/Core';

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

const core = new Core({
  host: WS_SERVER_HOST,
  port: WS_SERVER_PORT,
  store,
  date: {
    uiLoad: new Date(),
    uiRender: new Date(),
  },
});
window.core = core;

export const App = () => {
  const classes = useStyles({});

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
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
                  path='/message/:messageID'
                  render={({
                    match: {
                      params: { messageID },
                    },
                  }) => <View core={core} messageID={parseInt(messageID)} />}
                />
              </Switch>
            </main>
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};
