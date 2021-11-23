import React from 'react';
import { TextareaAutosize, Button } from '@mui/material';

export const Editor = ({ state, onChange }) => {
  const { text } = state;

  return (
    <>
      <TextareaAutosize
        aria-label='Document Contents'
        placeholder='Empty'
        value={text}
        onChange={onChange}
        style={{ width: 200 }}
      />
      <Button>Publish</Button>
      <Button>Delete</Button>
    </>
  );
};
