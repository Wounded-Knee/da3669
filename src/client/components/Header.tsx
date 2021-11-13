import { AppBar, makeStyles, Toolbar, Typography, Grid, Button } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import StorageIcon from '@material-ui/icons/Storage';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    dataButton: {
      textAlign: 'right',
    },
  }),
);
export const Header: React.FunctionComponent = ({ drawerState: state }) => {
  const classes = useStyles({});
  const [drawerState, setDrawerState] = state;
  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <Grid container>
          <Grid item xs={8}>
            <Typography variant='h6' noWrap>
              DA3669 Prototype
            </Typography>
          </Grid>
          <Grid item xs={4} className={classes.dataButton}>
            <Button onClick={() => setDrawerState(!drawerState)}>
              <StorageIcon />
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
