import React from 'react';
import { List, ListItemText, ListItem, ListItemIcon } from '@mui/material';
import Profanity from '../lib/controllerModules/Profanity';

const modules = [Profanity];
export const Experience: React.FunctionComponent = () => {
  return (
    <>
      <ListItem>
        <ListItemText primary='Experience' />
      </ListItem>
      {modules.map(({ ui: ModuleUI }, index) => (
        <ListItem key={index}>
          <ModuleUI />
        </ListItem>
      ))}
    </>
  );
};
