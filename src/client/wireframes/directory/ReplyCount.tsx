/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx } from '@emotion/react';

export const ReplyCount = ({ count }) => (
  <>
    <span
      css={css`
        color: white;
        background: red;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
        height: 1em;
        width: 1em;
        line-height: 1em;
        text-align: center;
        font-weight: bold;
        margin: 0 0.5em;
      `}
    >
      {count}
    </span>
    Replies
  </>
);
