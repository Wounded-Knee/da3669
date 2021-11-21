import React from 'react';
import { List, ListItemText, ListItem, ListItemIcon } from '@material-ui/core';
import StorageIcon from '@material-ui/icons/Storage';
import { JSON } from './JSON';
import { Drawer } from './Drawer';

export const DataView: React.FunctionComponent<{ core: any }> = ({ core }) => {
  return (
    <Drawer drawerName='data'>
      <List>
        <ListItem>
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary='D³ata Inspector' secondary={`${core.all.length} entities`} />
        </ListItem>
      </List>

      <JSON data={core.state} />
    </Drawer>
  );
};
