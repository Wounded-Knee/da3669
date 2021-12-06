import React, { useState } from 'react';
import { ContextStacker } from './ContextStacker';
import { Slider } from '@mui/material';

export const initialState = {
  text: 'Untitled',
  html: (props) => <>{props.children}</>,
  chatLog: [],
  recursionIndex: 0,
  recursionLimit: 50,
};

export const Index = () => {
  const [depth, setDepth] = useState(0);
  return (
    <>
      <Slider
        aria-label='Depth'
        defaultValue={0}
        getAriaValueText={() => depth}
        onChange={(event, val) => {
          setDepth(val);
        }}
        valueLabelDisplay='auto'
        step={1}
        marks
        min={0}
        max={50}
      />

      <ContextStacker
        state={{
          ...initialState,
          recursionLimit: depth,
        }}
      />
    </>
  );
};
