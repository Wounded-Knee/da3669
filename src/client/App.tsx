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
import { data as staticEntities } from './wireframes/simple3/data';
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

const stateReducer = (state, { type, payload }) => {
  switch (type) {
    case 'ADD_ENTITY':
      return {
        ...state,
        entities: [...state.entities, payload],
      };
      break;
    case 'DRAWER':
      const [drawerName, open] = payload;
      return {
        ...state,
        ui: {
          ...state.ui,
          drawers: {
            ...state.ui.drawers,
            [drawerName]: open,
          },
        },
      };
      break;
    default:
      throw new Error(`Unrecognized action type ${type} to state reducer.`);
      break;
  }
};

const initialState = {
  entities: staticEntities,
  user: {
    id: null,
  },
  ui: {
    drawers: {
      info: false,
      data: false,
    },
    selectedEntityIndex: null,
    selectedEntityHistory: [],
  },
};

export const App = () => {
  const classes = useStyles({});
  const stateManagement = useReducer(stateReducer, initialState);
  const [state, stateDispatch] = stateManagement;
  const infoEntity = '';

  const core = new Core(stateManagement);

  return (
    <ReduxProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <div className={classes.root}>
            <CssBaseline />
            <Header core={core} />
            <SideMenu core={core} />
            <DataView core={core} />
            <InfoView core={core} entity={infoEntity} />
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
