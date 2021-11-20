import React from 'react';
import { List, ListItemText, ListItem, ListItemIcon, ListSubheader, Divider } from '@material-ui/core';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import { Drawer } from './Drawer';

export const InfoView: React.FunctionComponent<{ core: any }> = ({ core }) => {
  const [selectedEntity, ...selectedEntityHistory] = core.uiGetSelectedEntityHistory();
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
