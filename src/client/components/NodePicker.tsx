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
          type: server.CREATE,
          payload: [nodeGenerator(value)],
        }).then(({ payload: newNodes }) => onPick(newNodes));
      case 'selectOption':
        onPick([value]);
        break;
      case 'blur':
        break;
      default:
        break;
    }
  };

  return (
    <Autocomplete
      css={css`
        flex: 1 0 auto;
        box-shadow: 0px 0px 9px 2px rgba(0, 0, 0, 0.75) inset;
        margin: 1em -15px 0;

        & fieldset {
          border: 0;
        }
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
