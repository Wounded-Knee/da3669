import { AppBar, makeStyles, Toolbar, Typography, Grid, Button } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import StorageIcon from '@material-ui/icons/Storage';
import InfoIcon from '@material-ui/icons/Info';
import React from 'react';
import { UserSelect } from '../wireframes/simple3/userselect';
import { entityTypes } from '../../shared/lib/classes/entities';

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

export const Header: React.FunctionComponent<{ core: any }> = ({ core }) => {
  const classes = useStyles({});
  const users = core.getEntitiesByType(entityTypes.USER);
  const currentUser = core.user;
  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant='h6' noWrap>
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
