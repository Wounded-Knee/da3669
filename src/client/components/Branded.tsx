/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { TextareaAutosize as MuiTextareaAutosize, Button as MuiButton, Input as MuiInput } from '@mui/material';

export const Input = ({ ...props }) => <MuiInput {...props} />;

export const Button = ({ children, ...props }) => {
  const styles = {
    button: css`
      animation: color-change 720s linear infinite;
      color: #ffff00;
    `,
  };

  return (
    <MuiButton sx={styles.button} {...props}>
      {children}
    </MuiButton>
  );
};
export const TextareaAutosize = ({ ...props }) => <MuiTextareaAutosize {...props} />;
