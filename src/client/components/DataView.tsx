import React from 'react';
import { List, ListItemText, ListItem, ListItemIcon } from '@material-ui/core';
import StorageIcon from '@mui/icons-material/Storage';
import { JSON } from './JSON';
import { Drawer } from './Drawer';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  state: state,
});

export const DataView: React.FunctionComponent = connect(mapStateToProps)(({ state }) => {
  return (
    <Drawer drawerName='data'>
      <List>
        <ListItem>
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary='D³ata Inspector' secondary={`${state.entities.length} entities`} />
        </ListItem>
      </List>

      <JSON data={state} />
    </Drawer>
  );
});
