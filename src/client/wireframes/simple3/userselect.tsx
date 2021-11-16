import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { TYPE_USER } from './data';

export const UserSelect: React.FunctionComponent<{ users: any; onSubmit: any }> = ({ users, onSubmit }) => {
  const [user, selectUser] = useState('');

  const onChange = ({ target: { value } }) => {
    selectUser(value);
    onSubmit(value);
  };

  return (
    <FormControl fullWidth>
      <Select labelId='demo-simple-select-label' id='demo-simple-select' value={user} label='User' onChange={onChange}>
        {users.map(({ id, name }, index) => (
          <MenuItem key={index} value={id}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
