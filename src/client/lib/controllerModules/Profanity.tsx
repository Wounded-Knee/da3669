import React from 'react';
import { IControllerModuleShared } from '../../../shared/lib/controllerModules/ControllerModuleInterface';
import { ListItemText, Switch } from '@mui/material';

const Profanity: IControllerModuleShared = {
  ui: () => {
    return (
      <>
        <ListItemText primary='Profanity' />
        <Switch />
      </>
    );
  },
};

export default Profanity;
