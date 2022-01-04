/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import {
  PlayCircle as PlayCircleIcon,
  StopCircle as StopCircleIcon,
  PauseCircle as PauseCircleIcon,
} from '@mui/icons-material';
import { TimeCode } from './TimeCode';
import { ReplyCount } from './ReplyCount';
import { LiveCount } from './LiveCount';
import { IconButton } from '@mui/material';

const getPct = (length, timeCode) => (1 / (length / timeCode)) * 100;
export const VoiceNode = ({ src, length, spliceNodes, replyCount, liveListeners }) => {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  return (
    <div>
      {(spliceNodes || []).map((timeCode, index) => (
        <div
          key={index}
          css={css`
            z-index: 100;
            background: blue;
            width: 5px;
            height: 66px;
            position: absolute;
            left: ${getPct(length, timeCode)}px;
          `}
        ></div>
      ))}
      <img
        width='100%'
        src={src}
        css={css`
          position: relative;
          left: 0;
          object-fit: cover;
          height: 66px;
        `}
      />
      <IconButton aria-label='Play' onClick={() => setPlaying(!playing)}>
        {playing ? <PauseCircleIcon /> : <PlayCircleIcon />}
      </IconButton>

      <TimeCode length={length} />
      <ReplyCount count={replyCount} />
      <LiveCount count={liveListeners} />
    </div>
  );
};
