import { AppBar, makeStyles, Toolbar, Typography, Grid, Button } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import StorageIcon from '@material-ui/icons/Storage';
import InfoIcon from '@material-ui/icons/Info';
import React from 'react';
import { UserSelect } from './UserSelect';
import { entityTypes } from '../../shared/lib/classes/entities';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      '@keyframes a': {
        '0%': {
          backgroundPosition: '0 -200%',
        },
        '100%': {
          backgroundPosition: '0 0',
        },
      },
    },
    appBar: {
      background:
        'linear-gradient(rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%) 0 0/100% 10000%',
      animation: 'a 720s linear infinite',
      zIndex: theme.zIndex.drawer + 1,
    },
    dataButton: {
      textAlign: 'right',
    },
  }),
);

export const Header: React.FunctionComponent<{ core: any }> = ({ core }) => {
  const classes = useStyles({});
  const users = core.getEntitiesByType(entityTypes.USER);
  const currentUser = core.user;
  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <Grid container alignItems='center'>
          <Grid item xs={10}>
            <Typography variant='h5' noWrap>
              🙃 DA3669 Prototype
            </Typography>
          </Grid>
          <Grid item xs={1} className={classes.dataButton}>
            <UserSelect users={users} onSubmit={(userID) => (core.user = userID)} />
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
