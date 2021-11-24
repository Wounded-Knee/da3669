/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { TextareaAutosize as MuiTextareaAutosize, Button as MuiButton } from '@mui/material';

export const Button = ({ children, ...props }) => {
  return (
    <MuiButton
      css={css`
        animation: 'color-change 20s linear infinite';
      `}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
export const TextareaAutosize = ({ ...props }) => <MuiTextareaAutosize {...props} />;
