import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, ListItemText, ListItem, ListItemIcon } from '@mui/material';
import Profanity from '../lib/controllerModules/Profanity';

const modules = [Profanity];
export const Experience: React.FunctionComponent = () => {
  const experienceCfg = useSelector((state) => state.ui.user.experienceCfg);

  return (
    <>
      <ListItem>
        <ListItemText primary='Experience' />
      </ListItem>

      {modules.map(({ ui: ModuleUI }, index) => (
        <ListItem key={index}>
          <ModuleUI experienceCfg={experienceCfg} />
        </ListItem>
      ))}
    </>
  );
};
