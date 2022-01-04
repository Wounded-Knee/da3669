import React from 'react';
import { IControllerModuleShared } from '../../../shared/lib/controllerModules/ControllerModuleInterface';
import { Checkbox, ListItemText, Switch } from '@mui/material';
import {
  AccountCircle as UserActiveIcon,
  AccountCircleOutlined as UserIcon,
  AodOutlined as NodeIcon,
  Aod as NodeActiveIcon,
  Cloud as AncestorActiveIcon,
  CloudOutlined as AncestorIcon,
} from '@mui/icons-material';

const Profanity: IControllerModuleShared = {
  ui: () => {
    // const isChecked = state.profanity;

    return (
      <>
        {/* <ListItemText primary='Profanity' />
        <Checkbox value={inputProps={{ 'aria-label': 'User Override' }} icon={<UserIcon />} checkedIcon={<UserActiveIcon />} /> */}
      </>
    );
  },
};

export default Profanity;
