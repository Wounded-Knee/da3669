import { CssBaseline, makeStyles } from '@material-ui/core';
import { createStyles, Theme, ThemeProvider, createTheme } from '@material-ui/core/styles';
import React from 'react';

// Wireframes
import { Core } from './lib/Core';
import { useStateManager } from './lib/stateManager/useStateManager';
import Client from './wireframes/simple3/WebSocketClient';

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
      display: 'block',
      margin: 'auto',
      width: '300px',
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
  }),
);

const uiLoad = new Date();

export const CoreTest: React.FunctionComponent = () => {
  const classes = useStyles({});
  const [state, dispatch] = useStateManager();
  const core = new Core({
    clientState: state,
    clientDispatch: dispatch,
    serverDispatch: (action) => {
      console.log('Server Dispatch: ', action);
      return void 0;
    },
    date: {
      uiLoad,
      uiRender: new Date(),
    },
  });

  window.core = core;

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <dl>
          <dt>Entity Count</dt>
          <dd>{core.all.length}</dd>

          <dt>User ID</dt>
          <dd>{core.user.id}</dd>

          <dt>Start Date</dt>
          <dd>{core.date.uiLoad.toString()}</dd>
        </dl>
      </div>
    </ThemeProvider>
  );
};
