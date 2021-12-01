/** @jsx jsx */
import React from 'react';
import { useRainbow } from '../lib/useRainbow';
import { css, jsx } from '@emotion/react';
import { TextareaAutosize as MuiTextareaAutosize, Button as MuiButton, Input as MuiInput } from '@mui/material';

const changeLength = 700;
export const getAnimationCss = (type) => {
  return css`
    animation: ${type}-change ${changeLength}s linear infinite;
  `;
};

export const getRotationColor = () => `hsl(${Date.now() % 360},80%,50%)`;

export const Input = ({ ...props }) => <MuiInput {...props} />;

export const Button = ({ children, ...props }) => {
  const styles = {
    button: css`
      color: ${useRainbow(100, 70)};
    `,
  };

  return (
    <MuiButton css={styles.button} {...props}>
      {children}
    </MuiButton>
  );
};

export const TextareaAutosize = ({ ...props }) => {
  const styles = {
    textareaautosize: css`
      border: 1px solid ${useRainbow()};
      color: #ffffff;
      background-color: #303030;

      &:focus,
      &:active {
        outline: 1px dotted ${useRainbow(100, 70)};
      }
    `,
  };

  return <MuiTextareaAutosize css={styles.textareaautosize} {...props} />;
};
