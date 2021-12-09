/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Grid } from '@mui/material';

export const Loading: React.FunctionComponent = () => {
  return (
    <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '95vh' }}>
      <Grid
        item
        css={css`
          font-size: 30vw;
          background: linear-gradient(
            327deg,
            #ffaa00,
            #ffff00,
            #00ff00,
            #00ffaa,
            #0000ff,
            #aa00ff,
            #ff00aa,
            #ff0000,
            #ff00aa,
            #aa00ff,
            #0000ff,
            #00ffaa,
            #00ff00,
            #ffff00,
            #ffaa00,
            #ff0000
          );
          background-size: 500% 500%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          -webkit-animation: RainbowFuckery 1.5s linear infinite;
          -moz-animation: RainbowFuckery 1.5s linear infinite;
          animation: RainbowFuckery 1.5s linear infinite;

          @keyframes RainbowFuckery {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 100% 100%;
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

          -webkit-animation: pulsate 0.5s linear;
          -webkit-animation-iteration-count: infinite;
          opacity: 0.5;

          @-webkit-keyframes pulsate {
            0% {
              opacity: 0.25;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0.25;
            }
          }
        `}
      >
        Loading...
      </Grid>
    </Grid>
  );
};
