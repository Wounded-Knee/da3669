import React, { useState } from 'react';
import {
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  ListSubheader,
  Divider,
  Button,
  Grid,
  Drawer,
  makeStyles,
  Typography,
  Toolbar,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import { createStyles, Theme } from '@material-ui/core/styles';
import ReactJson from 'searchable-react-json-view';

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

export const InfoView: React.FunctionComponent = ({ core }) => {
  const classes = useStyles({});
  const selectedEntity = core.ui.getSelectedEntity();
  const selectedEntityHistory = core.ui.getSelectedEntityHistory();
  return (
    <Drawer
      anchor='right'
      variant='persistent'
      open={core.ui.drawerState('info')}
      onClose={() => core.ui.closeDrawer('info')}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar}></div>

      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component='nav'
        aria-labelledby='nested-list-subheader'
        subheader={
          <ListSubheader component='div' id='nested-list-subheader'>
            Information
          </ListSubheader>
        }
      >
        <ListItem>
          <ListItemIcon>
            <TouchAppIcon />
          </ListItemIcon>
          <ListItemText primary='Selected Entities' secondary={`${selectedEntityHistory.length} entities`} />
        </ListItem>

        <Divider />

        {selectedEntityHistory.map((entity, index) => (
          <ListItem button key={index}>
            <ListItemText primary={entity.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
