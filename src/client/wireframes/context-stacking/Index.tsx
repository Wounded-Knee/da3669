/** @jsxFrag React.Fragment */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import { ContextStacker } from './ContextStacker';
import { BottomNavigation, BottomNavigationAction, Paper, Slider } from '@mui/material';
import {
  LocalPolice as ModerateIcon,
  Favorite as FavoriteIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';

export const Index = () => {
  const [depth, setDepth] = useState(10);
  const [coolState, setCoolState] = useState({});
  const [path, setPath] = useState([]);

  const addPath = (index) => setPath([...path, index]);
  const setDepthOk = (depth) => setPath(path.slice(0, depth));
  useEffect(() => setDepth(path.length), [path.length]);

  const data = {
    addPath,
    setDepth: setDepthOk,
    path: path.slice(0, depth),
    text: 'Hello.',
    depthLimit: depth,
    ancestorProps: {
      title: 'Welcome!',
    },
    callback: setCoolState,
    children: [
      {
        text: 'Hitler did something wrong.',
        mutation: { background: 'http://totallyhistory.com/wp-content/uploads/2013/10/Adolf-Hitler.jpg' },
      },
      {
        text: 'Blah blah blah, but, in cyan',
        color: 'cyan',
      },
      {
        text: 'I like camping.',
        mutation: { background: 'http://jpkramer.com/fire2.gif' },
      },
      {
        text: 'Who wants to talk spaceships?',
        mutation: {
          title: 'Spaceship Talk!',
          background: 'https://blogs.esa.int/alexander-gerst/files/2014/03/10729802334_f51e9b69d8_o.jpg',
        },
      },
      { text: 'Britta, are you here?' },
      {
        text: 'Hey look I can change the background.',
        color: 'yellow',
        mutation: {
          background: 'https://i.pinimg.com/originals/66/f8/59/66f859fc32c72e5f8401cc03e09ebc18.png',
        },
        children: [
          {
            text: 'I would rather talk about trees.',
            mutation: {
              title: 'Tree Chat',
              background: 'http://wallpaperose.com/wp-content/uploads/2013/07/Natural-Leaves-Widescreen.jpg',
            },
            children: [
              {
                text: 'Okay. Lets talk about trees, then.',
              },
              {
                text: 'No. Trees are stupid.',
              },
            ],
          },
        ],
      },
    ],
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
        background-size: cover;
        background-position: center;
        transition: background-image 2s ease-in-out;
      `}
    >
      <Slider
        aria-label='Depth'
        value={path.length}
        defaultValue={path.length}
        getAriaValueText={() => depth}
        onChange={(event, val) => {
          setDepth(val);
        }}
        valueLabelDisplay='auto'
        step={1}
        marks
        min={0}
        max={path.length}
      />

      <h1>{coolState.title}</h1>

      {stack(data)}

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation showLabels>
          <BottomNavigationAction label='Moderate' icon={<ModerateIcon />} />
          <BottomNavigationAction label='Favorites' icon={<FavoriteIcon />} />
          <BottomNavigationAction label='Nearby' icon={<LocationOnIcon />} />
        </BottomNavigation>
      </Paper>
    </div>
  );
};

const stack = (data) => {
  const { children, ...props } = data;
  return <ContextStacker {...props}>{children && children.map((child) => stack(child))}</ContextStacker>;
};
