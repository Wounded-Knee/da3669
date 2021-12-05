import React from 'react';
import { List, ListItemText, ListItem, ListItemIcon, ListSubheader, Divider } from '@mui/material';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Drawer } from './Drawer';

export const InfoView: React.FunctionComponent = () => {
  return (
    <Drawer drawerName='info'>
      <List
        component='nav'
        aria-labelledby='nested-list-subheader'
        subheader={
          <ListSubheader component='div' id='nested-list-subheader'>
            Information
          </ListSubheader>
        }
      >
        <Divider />
        <ListItem>
          <ListItemIcon>
            <TouchAppIcon />
          </ListItemIcon>
          <ListItemText primary='Recent Entities' secondary='?' />
        </ListItem>

        <Divider />
      </List>
    </Drawer>
  );
};
