import { makeStyles, CardHeader } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

const useStyles = makeStyles(() => ({
  LogoImg: {
    width: 150,
    paddingBottom: 25,
  },
}));

export const Home: React.FunctionComponent = () => {
  const classes = useStyles({});
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='FullStack React with TypeScript' />
        <CardContent>
          <img src='/assets/images/logo.png' className={classes.LogoImg} />
          <Typography>
            This is a starter kit to get you up and running with React & TypeScript on top of material-ui.
          </Typography>
          <Typography>
            You can read more about how to share code between the client and the server at this{' '}
            <a href='https://medium.com/front-end-hacking/client-server-and-shared-code-846097c5260e'>
              medium blog post
            </a>
            .
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
