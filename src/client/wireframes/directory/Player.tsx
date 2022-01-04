/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx } from '@emotion/react';
import { ReactMediaRecorder } from 'react-media-recorder';

export const Player = () => {
  return (
    <div
      css={css`
        flex-grow: 1;
        height: 100%;
        margin: -1em -3em;
        overflow: hidden;
        padding: 2em;
      `}
    >
      Player
    </div>
  );
};
