import React, { useState } from 'react';
import { Drawer, makeStyles, Typography, Toolbar } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import ReactJson from 'searchable-react-json-view';

const drawerWidth = 650;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
  }),
);

export const DataView: React.FunctionComponent = ({ state, core }) => {
  const [drawerState, setDrawerState] = state;
  const classes = useStyles({});
  return (
    <Drawer
      anchor='right'
      open={drawerState}
      onClose={() => setDrawerState(false)}
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar}>
        <Toolbar>
          <Typography variant='h6' noWrap onClick={() => setDrawerState(!drawerState)}>
            D3 Data
          </Typography>
        </Toolbar>
      </div>
      <ReactJson
        displayObjectSize={false}
        displayDataTypes={false}
        displayArrayKey={false}
        quotesOnKeys={false}
        enableClipboard={false}
        name={false}
        src={core.data}
        theme='shapeshifter'
      />
    </Drawer>
  );
};
