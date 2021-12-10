/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import { dispatch } from './webSocket';
import { server } from '../../../shared/lib/redux/actionTypes';

export const NodePicker = ({
  options = [],
  nodeGenerator = (value) => ({}),
  onPick = (nodes) => void 0,
  label = 'Node Picker',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [createdNodes, setCreatedNodes] = useState([]);

  const onCommit = (value) => {
    console.log('User Commit ', value);
    setInputValue('');
    dispatch({
      type: server.ABSORB_NODES,
      payload: [nodeGenerator(value)],
    }).then(({ payload: newNodes }) => onPick(newNodes));
  };

  const onChange = (event, value, reason) => {
    switch (reason) {
      case 'selectOption':
        onPick([value]);
        break;
      default:
        console.log('onChange', event, value, reason);
        break;
    }
  };

  return (
    <Autocomplete
      freeSolo
      id='NodePicker'
      disableClearable
      autoComplete
      autoSelect
      onChange={onChange}
      onKeyDown={({ key }) => key === 'Enter' && onCommit(inputValue)}
      inputValue={inputValue}
      onInputChange={(event, value) => setInputValue(value)}
      options={options}
      getOptionLabel={(option) => option.text || option}
      isOptionEqualToValue={({ text = '' }, value = '') =>
        value.toLowerCase ? value.toLowerCase() === text.toLowerCase() : false
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            type: 'search',
          }}
        />
      )}
    />
  );
};
