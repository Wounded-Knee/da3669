import React from 'react';
import { Drawer } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { core } from '../core';

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

export const WithDrawer = (Component) => {
  const classes = useStyles({});

  return (
    <Drawer
      anchor='right'
      variant='persistent'
      open={core.ui.drawers.info}
      onClose={() => core.uiSetDrawer('info', false)}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar}></div>
      <Component />
    </Drawer>
  );
};
