/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Grid } from '@mui/material';

export const Loading: React.FunctionComponent = () => {
  return (
    <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
      <Grid
        item
        css={css`
          font-size: 30vw;
          background: linear-gradient(327deg, #ff0000, #ffaa00, #ffff00, #00ff00, #00ffaa, #0000ff, #aa00ff, #ff00aa);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          -webkit-animation: AnimationName 3s ease infinite;
          -moz-animation: AnimationName 3s ease infinite;
          animation: AnimationName 3s ease infinite;

          @-webkit-keyframes AnimationName {
            0% {
              background-position: 9% 0%;
            }
            50% {
              background-position: 92% 100%;
            }
            100% {
              background-position: 9% 0%;
            }
          }
          @-moz-keyframes AnimationName {
            0% {
              background-position: 9% 0%;
            }
            50% {
              background-position: 92% 100%;
            }
            100% {
              background-position: 9% 0%;
            }
          }
          @keyframes AnimationName {
            0% {
              background-position: 9% 0%;
            }
            50% {
              background-position: 92% 100%;
            }
            100% {
              background-position: 9% 0%;
            }
          }
        `}
      >
        D<sup>3</sup>
      </Grid>
      <Grid
        item
        css={css`
          font-size: 2em;
          color: #fff;
        `}
      >
        Loading...
      </Grid>
    </Grid>
  );
};
