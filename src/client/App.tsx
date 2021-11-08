import { CssBaseline, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
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

// Wireframes
import data from './wireframes/mockdata';
const { routes } = data;
import { Rubric } from './wireframes/Rubric';
import { Votes } from './wireframes/Votes';
import { Screen1 } from './wireframes/Screen1';
import { Chat } from './wireframes/Chat';

const wsClient = new Client();

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

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <CssBaseline />
        <Header />
        <SideMenu />
        <main className={classes.main}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path='/' component={Home} />

            <Route exact path='/test' render={() => <Test wsClient={wsClient} />} />
            <Route exact path='/test2' render={() => <Test2 wsClient={wsClient} />} />

            <Route exact path='/rubric' component={Rubric} />
            <Route exact path='/votes' component={Votes} />
            <Route exact path='/screen1' component={Screen1} />
            <Route exact path='/chat' component={Chat} />

            <Route exact path='/usage' component={Usage} />
            <Route path='/fetch-example' component={UsersList} />
            <Route path='/lazy-example' component={LazyLoadingExample} />
            <Route path='/styled-example' component={StyledComponentsExample} />
            <Route path='/router-example/:slug' component={RouterExample} />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
};
