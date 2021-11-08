import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, Grid, Paper } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ChatMessage } from './ChatMessage';
import data from './mockdata';

const { chat } = data;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

export const Chat: React.FunctionComponent = () => {
  const classes = useStyles();
  return (
    <Grid container spacing={3} alignItems='stretch' direction='row'>
      <Grid item xs={8}>
        <Paper className={classes.paper}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {chat.map(({ author, messages }, index) => (
              <ListItem key={index} alignItems='flex-start'>
                <ListItemAvatar>
                  <Avatar
                    alt={author}
                    src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.portcityrobotics.org%2Fwp-content%2Fuploads%2F2016%2F09%2Fgeneric_avatar-300x300.jpg&f=1&nofb=1'
                  />
                </ListItemAvatar>
                <ChatMessage avatar={''} author='Bob Hope' messages={messages} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs>
        <Paper className={classes.paper}>xs</Paper>
      </Grid>
    </Grid>
  );
};
