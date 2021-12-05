import React from 'react';
import { Drawer as MuiDrawer } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { createStyles, Theme } from '@mui/material';
import { connect } from 'react-redux';

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
      minHeight: 50,
    },
  }),
);

const mapStateToProps = (state) => {
  return {
    drawers: state.ui.drawers,
  };
};

export const Drawer: React.FunctionComponent = connect(mapStateToProps)(({ children, drawerName, drawers }) => {
  const classes = useStyles({});

  return (
    <MuiDrawer
      anchor='right'
      variant='persistent'
      open={drawers[drawerName]}
      onClose={() => core.uiSetDrawer(drawerName, false)}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar}></div>

      {children}
    </MuiDrawer>
  );
});
