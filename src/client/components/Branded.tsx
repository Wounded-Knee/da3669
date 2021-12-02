/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState } from 'react';
import { useRainbow } from '../lib/useRainbow';
import { css, jsx } from '@emotion/react';
import { TextareaAutosize as MuiTextareaAutosize, Button as MuiButton, Input as MuiInput } from '@mui/material';
import { Link as ReactRouterLink } from 'react-router-dom';

export const Link = (props) => {
  return (
    <ReactRouterLink
      {...props}
      css={css`
        transition: color 0.25s linear;

        &:link,
        &:visited,
        &:active {
          text-decoration: none;
          color: ${useRainbow(50, 90)};
        }

        &:hover {
          color: ${useRainbow(70, 70)};
        }
      `}
    />
  );
};

export const Input = ({ value, onChange, onEnter, ...props }) => {
  const [state, setState] = useState(value || '');

  const styles = {
    input: css`
      color: ${useRainbow(100, 70)};
    `,
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
      border: 2px solid ${useRainbow()};
      color: #ffffff;
      background-color: transparent;
      transition: border-color 0.4s linear;

      &:focus,
      &:active {
        border: 2px solid ${useRainbow(100, 90)};
        outline: 0;
      }
    `,
  };

  return <MuiTextareaAutosize css={styles.textareaautosize} {...props} />;
};
