import { CssBaseline, makeStyles } from '@material-ui/core';
import { createStyles, Theme, ThemeProvider, createTheme } from '@material-ui/core/styles';
import React, { useState } from 'react';
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
import { data as initialData } from './wireframes/simple3/data';
import { DataView } from './components/DataView';
import { InfoView } from './components/InfoView';

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

export const App = () => {
  const classes = useStyles({});
  const [data, setData] = useState(initialData);
  const [user, setUser] = useState('');
  const dataState = useState(false);
  const infoState = useState(false);
  const [infoEntity, setInfoEntity] = useState('');

  const core = new Core(data, setData, user, setUser);

  return (
    <ReduxProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <div className={classes.root}>
            <CssBaseline />
            <Header dataState={dataState} infoState={infoState} core={core} />
            <SideMenu core={core} />
            <DataView state={dataState} core={core} />
            <InfoView state={infoState} entity={infoEntity} />
            <main className={classes.main}>
              <div className={classes.toolbar} />
              <Switch>
                <Route exact path='/' component={Home} />

                <Route exact path='/test' render={() => <Test wsClient={wsClient} />} />
                <Route exact path='/test2' render={() => <Test2 wsClient={wsClient} />} />

                <Route exact path='/rubric' component={Rubric} />
                <Route exact path='/votes' component={Votes} />
                <Route exact path='/screen1' component={Screen1} />
                <Route exact path='/chat' render={() => <Chat wsClient={wsClient} />} />
                <Route exact path='/simple' render={() => <Display {...displayProps} />} />
                <Route exact path='/simple2' render={() => <Navigator {...displayProps} />} />
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
                <Route path='/router-example/:slug' component={RouterExample} />
              </Switch>
            </main>
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </ReduxProvider>
  );
};
