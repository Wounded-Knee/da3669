import { AppBar, makeStyles, Toolbar, Typography, Grid, Button } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import StorageIcon from '@material-ui/icons/Storage';
import InfoIcon from '@material-ui/icons/Info';
import React from 'react';
import { UserSelect } from '../wireframes/simple3/userselect';
import { TYPE_USER } from '../wireframes/simple3/core';

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
export const Header: React.FunctionComponent = ({
  dataState: [dataState, setDataState],
  infoState: [infoState, setInfoState],
  core,
}) => {
  const classes = useStyles({});
  const users = core.getByType(TYPE_USER);
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
            <UserSelect users={users} currentUser={currentUser} onSubmit={(userID) => (core.user = userID)} />
          </Grid>
          <Grid item xs={1} className={classes.dataButton}>
            <Button onClick={() => setInfoState(!infoState)}>
              <InfoIcon />
            </Button>

            <Button onClick={() => setDataState(!dataState)}>
              <StorageIcon />
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
