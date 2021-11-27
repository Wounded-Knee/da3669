/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { TextareaAutosize as MuiTextareaAutosize, Button as MuiButton, Input as MuiInput } from '@mui/material';

const changeLength = 700;
export const getAnimationCss = (type) => {
  return css`
    animation: ${type}-change ${changeLength}s linear infinite;
  `;
};

export const Input = ({ ...props }) => <MuiInput {...props} />;

export const Button = ({ children, ...props }) => {
  const styles = {
    button: css`
      ${getAnimationCss('color')}
      color: #ffff00;
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
      ${getAnimationCss('border')}
      color: #ffffff;
      background-color: #303030;
      border: 1px solid black;
    `,
  };

  return <MuiTextareaAutosize css={styles.textareaautosize} {...props} />;
};
