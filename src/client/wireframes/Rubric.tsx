import React from 'react';
import Slider from '@material-ui/core/Slider';
import data from './mockdata';
const { useState } = React;
const {
  classifications: [classification],
} = data;

const getClassificationByIndex = (index) => classifications[index];

export const Rubric: React.FunctionComponent = ({ data }) => {
  const [confidence, setConfidence] = useState(0);

  return (
    <>
      <Slider
        aria-label='Small steps'
        defaultValue={confidence}
        step={1}
        marks={classification.values.map((val, index) => ({ value: index - 1, label: val }))}
        min={-1}
        max={1}
        valueLabelDisplay='off'
        onChange={(event, val) => setConfidence(val)}
      />
      <h1>Racist {confidence}</h1>
      <p>The content can be described as racist.</p>
    </>
  );
};
