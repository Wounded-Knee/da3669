import { AppBar, makeStyles, Toolbar, Typography, Grid, Button } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import StorageIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';
import React from 'react';
import { UserSelect } from './UserSelect';
import { appName } from '../config';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      animation: 'background-color-change 720s linear infinite',
      zIndex: theme.zIndex.drawer + 1,
    },
    dataButton: {
      textAlign: 'right',
    },
    toolbar: {
      minHeight: 50,
    },
  }),
);

export const Header: React.FunctionComponent = () => {
  const classes = useStyles({});

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Grid container alignItems='center'>
          <Grid item xs={10}>
            <Typography variant='h5' noWrap>
              🙃 {appName} Prototype
            </Typography>
          </Grid>
          <Grid item xs={1} className={classes.dataButton}>
            <UserSelect users={[]} onSubmit={console.log} />
          </Grid>
          <Grid item xs={1} className={classes.dataButton}>
            <Button onClick={() => core.uiSetDrawer('info')}>
              <InfoIcon />
            </Button>

            <Button onClick={() => core.uiSetDrawer('data')}>
              <StorageIcon />
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
