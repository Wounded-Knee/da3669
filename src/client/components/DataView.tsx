import React, { useState } from 'react';
import {
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  Button,
  Grid,
  Drawer,
  makeStyles,
  Typography,
  Toolbar,
} from '@material-ui/core';
import StorageIcon from '@material-ui/icons/Storage';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, Theme } from '@material-ui/core/styles';
import ReactJson from 'searchable-react-json-view';

const drawerWidth = 450;

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
      backgroundColor: 'red',
    },
  }),
);

export const DataView: React.FunctionComponent = ({ core }) => {
  const classes = useStyles({});
  return (
    <Drawer
      anchor='right'
      variant='persistent'
      open={core.ui.drawerState('data')}
      onClose={() => core.ui.closeDrawer('data')}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar}></div>

      <List>
        <ListItem>
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary='D³ata Inspector' secondary={`${core.data.length} entities`} />
        </ListItem>
      </List>

      <ReactJson
        displayObjectSize={false}
        displayDataTypes={false}
        displayArrayKey={false}
        quotesOnKeys={false}
        enableClipboard={false}
        name={false}
        src={core.data}
        theme='shapeshifter'
      />
    </Drawer>
  );
};
