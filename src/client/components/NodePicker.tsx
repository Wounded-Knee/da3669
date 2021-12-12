/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import { dispatch } from '../webSocket';
import { v4 as uuidv4 } from 'uuid'; /* Ridiculous pt I */
import { server } from '../../shared/lib/redux/actionTypes';

export const NodePicker = ({
  options = [],
  nodeGenerator = (value) => ({}),
  onPick = (nodes) => void 0,
  label = 'Node Picker',
  sx = {},
}) => {
  const [chosenValue, setChosenValue] = useState('');

  const onChange = (event, value, reason) => {
    setChosenValue('');
    switch (reason) {
      case 'createOption':
        dispatch({
          type: server.ABSORB_NODES,
          payload: [nodeGenerator(value)],
        }).then(({ payload: newNodes }) => onPick(newNodes));
      case 'selectOption':
        onPick([value]);
        break;
      case 'blur':
        break;
      default:
        console.log('onChange', event, value, reason);
        break;
    }
  };

  return (
    <Autocomplete
      css={css`
        flex: 1 0 auto;
      `}
      id='NodePicker'
      key={uuidv4()} /* Ridiculous pt II */
      freeSolo
      autoComplete
      autoSelect
      blurOnSelect
      clearOnBlur
      onChange={onChange}
      value={chosenValue}
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
