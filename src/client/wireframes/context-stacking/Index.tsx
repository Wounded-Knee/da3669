/** @jsxFrag React.Fragment */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useState } from 'react';
import { ContextStacker } from './ContextStacker';
import { Slider } from '@mui/material';

export const Index = () => {
  const [depth, setDepth] = useState(0);
  const [coolState, setCoolState] = useState({});
  const [path, setPath] = useState([0, 0, 1]);

  const addPath = (index) => {
    console.log(index);
    setPath([...path, index]);
  };

  return (
    <div
      id='contextStacker'
      css={css`
        flex-grow: 1;
        height: 100%;
        margin: -1em;
        overflow: hidden;
        padding: 2em;
        background-image: url('${coolState.background}');
        transition: background-image 2s ease-in-out;
      `}
    >
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
        max={3}
      />

      {path.join('/')}
      <h1>{coolState.title}</h1>

      <ContextStacker
        addPath={addPath}
        path={path}
        text='Hello.'
        depthLimit={depth}
        ancestorProps={{
          title: 'Welcome!',
        }}
        callback={setCoolState}
        color='cyan'
      >
        <ContextStacker
          text='Hey look I can change the background.'
          color='yellow'
          changeAncestorProps={(props) => ({
            ...props,
            background: 'https://i.pinimg.com/originals/66/f8/59/66f859fc32c72e5f8401cc03e09ebc18.png',
          })}
        >
          <ContextStacker
            text='I would rather talk about trees.'
            mutation={{
              title: 'Tree Chat',
              background: 'http://wallpaperose.com/wp-content/uploads/2013/07/Natural-Leaves-Widescreen.jpg',
            }}
          >
            <ContextStacker text='Okay. Lets talk about trees, then.' />
            <ContextStacker text='No. Trees are stupid.' />
          </ContextStacker>
        </ContextStacker>
      </ContextStacker>
    </div>
  );
};
