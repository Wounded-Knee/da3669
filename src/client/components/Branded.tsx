/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import { TextareaAutosize as MuiTextareaAutosize, Button as MuiButton, Input as MuiInput } from '@mui/material';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { useTheme } from '@mui/styles';

export const Link = (props) => {
  const theme = useTheme();
  return (
    <MuiLink
      component={ReactRouterLink}
      underline='none'
      {...props}
      css={css`
        transition: color 0.25s linear;

        &:hover {
          color: ${theme.palette.secondary.dark};
        }
      `}
    />
  );
};

export const Input = ({ value, onChange, onEnter, ...props }) => {
  const [state, setState] = useState(value || '');

  const styles = {
    input: css``,
  };

  return (
    <MuiInput
      css={styles.input}
      value={state}
      {...props}
      onKeyDown={({ keyCode }) => onEnter && keyCode === 13 && onEnter(state)}
      onChange={(e) => {
        const {
          target: { value },
        } = e;
        onChange && onChange(e);
        setState(value);
      }}
    />
  );
};

export const Button = ({ children, ...props }) => {
  const styles = {
    button: css``,
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
      border: 2px solid;
      color: #ffffff;
      background-color: transparent;
      transition: border-color 0.4s linear;

      &:focus,
      &:active {
        border: 2px solid;
        outline: 0;
      }
    `,
  };

  return <MuiTextareaAutosize css={styles.textareaautosize} {...props} />;
};
