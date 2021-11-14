import React, { useState } from 'react';
import { Button, Grid, Drawer, makeStyles, Typography, Toolbar } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, Theme } from '@material-ui/core/styles';
import ReactJson from 'searchable-react-json-view';

const drawerWidth = 350;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerPaper: {
      width: drawerWidth,
    },
    closeButton: {
      textAlign: 'right',
    },
    toolbar: {
      ...theme.mixins.toolbar,
      backgroundColor: 'green',
    },
  }),
);

export const InfoView: React.FunctionComponent = ({ core }) => {
  const classes = useStyles({});
  return (
    <Drawer
      anchor='right'
      variant='persistent'
      open={core.ui.drawerState('info')}
      onClose={() => core.ui.closeDrawer('info')}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar}></div>

      <div>Info</div>
    </Drawer>
  );
};
