import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loading: {
      fontSize: '15em',
      color: '#fff',
    },
  }),
);

export const Loading: React.FunctionComponent = () => {
  const classes = useStyles({});

  return (
    <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
      <Grid item className={classes.loading}>
        D<sup>3</sup>
      </Grid>
    </Grid>
  );
};
