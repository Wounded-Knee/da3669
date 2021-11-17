import { CssBaseline, makeStyles } from '@material-ui/core';
import { createStyles, Theme, ThemeProvider, createTheme } from '@material-ui/core/styles';
import React, { useReducer } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; // Pages
import { Header } from './components/Header';
import { SideMenu } from './components/SideMenu';
import { Home } from './components/Home';
import { Usage } from './components/Usage';
import { LazyLoadingExample } from './components/LazyLoadingExample';
import { RouterExample } from './components/RouterExample';
import { StyledComponentsExample } from './components/StyledComponentsExample';
import { UsersList } from './components/UsersList';
import Client from '../shared/lib/Client';

// Custom
import { Test } from './components/Test';
import { Test2 } from './components/Test2';
import { ReduxContext, ReduxProvider } from './context/ReduxContext';

// Wireframes
import data from './wireframes/mockdata';
const { routes, displayProps } = data;
import { Rubric } from './wireframes/Rubric';
import { Votes } from './wireframes/Votes';
import { Screen1 } from './wireframes/Screen1';
import { Chat } from './wireframes/Chat';
import { Display } from './wireframes/simple/display';
import { Navigator } from './wireframes/simple2/navigator';
import { View } from './wireframes/simple3/view';
import { Core } from './wireframes/simple3/core';
import { DataView } from './components/DataView';
import { InfoView } from './components/InfoView';
import { stateManager, initialStateWithTestData } from './lib/redux';

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

const wsClient = new Client();

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

export const App = ({ setCore }) => {
  const classes = useStyles({});
  const stateManagement = stateManager(initialStateWithTestData);
  const [state, stateDispatch] = stateManagement;
  const infoEntity = '';
  const core = new Core(stateManagement);
  if (setCore) setCore(core);

  if (!window.core) {
    core.clobber();
  }
  window.core = core;

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <center>Test Mode</center>
      </div>
    </ThemeProvider>
  );
  /*
  return (
    <ReduxProvider>
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
                  }) => <View {...displayProps} core={core} messageID={parseInt(messageID)} />}
                />

                <Route exact path='/usage' component={Usage} />
                <Route path='/fetch-example' component={UsersList} />
                <Route path='/lazy-example' component={LazyLoadingExample} />
                <Route path='/styled-example' component={StyledComponentsExample} />
              </Switch>
            </main>
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </ReduxProvider>
  );
  */
};
