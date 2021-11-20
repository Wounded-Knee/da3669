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

export const InfoView: React.FunctionComponent<{ core: any }> = ({ core }) => {
  const classes = useStyles({});
  const [selectedEntity, ...selectedEntityHistory] = core.uiGetSelectedEntityHistory();
  return (
    <Drawer
      anchor='right'
      variant='persistent'
      open={core.ui.drawers.info}
      onClose={() => core.uiSetDrawer('info', false)}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar}></div>

      <List
        component='nav'
        aria-labelledby='nested-list-subheader'
        subheader={
          <ListSubheader component='div' id='nested-list-subheader'>
            Information
          </ListSubheader>
        }
      >
        {selectedEntity ? (
          <>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <TouchAppIcon />
              </ListItemIcon>
              <ListItemText primary='Selected Entity' />
            </ListItem>
            <ListItem button>
              <ListItemText primary={selectedEntity.text} />
            </ListItem>
          </>
        ) : (
          ''
        )}

        <Divider />
        <ListItem>
          <ListItemIcon>
            <TouchAppIcon />
          </ListItemIcon>
          <ListItemText primary='Recent Entities' secondary={`${selectedEntityHistory.length} entities`} />
        </ListItem>

        <Divider />

        {selectedEntityHistory.map(({ text, id }, index) => (
          <ListItem button key={index} onClick={() => core.ui.selectEntity(id)}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
