import React, { useState } from 'react';
import { TextField as MuiTextField } from '@material-ui/core';

export const TextField = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const onChange = ({ target: { value } }) => {
    setValue(value);
  };

  const onKeyDown = ({ keyCode }) => {
    if (keyCode === 13) {
      onSubmit(value);
      setValue('');
    }
  };

  return <MuiTextField onChange={onChange} onKeyDown={onKeyDown} value={value} />;
};
