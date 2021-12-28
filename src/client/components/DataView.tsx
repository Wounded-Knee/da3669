import React from 'react';
import { List, ListItemText, ListItem, ListItemIcon } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import { Drawer } from './Drawer';

export const DataView: React.FunctionComponent = () => {
  return (
    <Drawer drawerName='data'>
      <List>
        <ListItem>
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary='D³ata Inspector' secondary={`? entities`} />
        </ListItem>
      </List>
    </Drawer>
  );
};
