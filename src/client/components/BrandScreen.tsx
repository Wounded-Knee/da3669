/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { ReactNode } from 'react';
import { css, jsx } from '@emotion/react';
import { Grid } from '@mui/material';

const size = 170;
export const BrandScreen: React.FunctionComponent = ({
  speed = 1.5,
  children,
}: {
  speed: number;
  children: ReactNode;
}) => {
  return (
    <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '95vh' }}>
      <Grid
        item
        css={css`
          font-size: 60vw;
          font-weight: bold;
          background: radial-gradient(
            circle,
            rgba(0, 0, 0, 1) 13%,
            rgba(255, 255, 0, 1) 14%,
            rgba(255, 0, 0, 1) 36%,
            rgba(255, 255, 255, 1) 37%
          );
          background-position: center center;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          -webkit-animation: RainbowFuckery ${speed}s infinite;
          -moz-animation: RainbowFuckery ${speed}s infinite;
          animation: RainbowFuckery ${speed}s infinite;

          @keyframes RainbowFuckery {
            // scale down and scale up faster in irregular intervals to get the throbbing effect
            0% {
              background-size: ${size * 0.6}% ${size * 0.6}%;
            }
            5% {
              background-size: ${size * 0.9}% ${size * 0.9}%;
            }
            10% {
              background-size: ${size * 0.6}% ${size * 0.6}%;
            }
            15% {
              background-size: ${size * 1}% ${size * 1}%;
            }
            50% {
              background-size: ${size * 0.6}% ${size * 0.6}%;
            }
            100% {
              background-size: ${size * 0.6}% ${size * 0.6}%;
            }
          }
        `}
      >
        ⊕
      </Grid>
      <Grid
        item
        css={css`
          margin-top: -2em;
          font-size: 2em;
          color: #fff;

          -webkit-animation: pulsate ${speed}s linear;
          -webkit-animation-iteration-count: infinite;
          opacity: 0.5;
          text-shadow: rgba(255, 255, 255, 0) 0px 0px 11px;

          @-webkit-keyframes pulsate {
            0% {
              opacity: 0.25;
              text-shadow: rgba(255, 255, 255, 0) 0px 0px 11px;
            }
            50% {
              opacity: 1;
              text-shadow: rgba(255, 255, 255, 0.5) 0px 0px 11px;
            }
            100% {
              opacity: 0.25;
              text-shadow: rgba(255, 255, 255, 0) 0px 0px 11px;
            }
          }
        `}
      >
        {children}
      </Grid>
    </Grid>
  );
};
