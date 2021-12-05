import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { connect } from 'react-redux';
import { entityTypes } from '../../shared/lib/classes/entities';

const mapStateToProps = (state) => ({
  users: state.entities.filter(({ type }) => type === entityTypes.USER),
});

export const UserSelect: React.FunctionComponent<{ users: any; onSubmit: any }> = connect(mapStateToProps)(
  ({ users, onSubmit }) => {
    const [user, selectUser] = useState('');

    const onChange = ({ target: { value } }) => {
      selectUser(value);
      onSubmit(value);
    };

    return users && users.length ? (
      <FormControl fullWidth>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={user}
          label='User'
          onChange={onChange}
        >
          {users.map(({ id, name }, index) => (
            <MenuItem key={index} value={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ) : (
      <p>No Users</p>
    );
  },
);
