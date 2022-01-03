/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx } from '@emotion/react';
import { useNodes } from '../../lib/useNodes';
import { useParams } from 'react-router';
import { NodePicker } from '../../components/NodePicker';
import { Link } from '../../components/Branded';
import { useNavigate } from 'react-router-dom';
import mongoose from 'mongoose';
import { PassportContext } from '../../components/PassportContext';
import { PlayCircle as PlayCircleIcon, StopCircle as StopCircleIcon } from '@mui/icons-material';
import { TimeCode } from './TimeCode';
import { ReplyCount } from './ReplyCount';
import { LiveCount } from './LiveCount';

const getPct = (length, timeCode) => (1 / (length / timeCode)) * 100;
export const VoiceNode = ({ src, length, spliceNodes, replyCount, liveListeners }) => {
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
      <PlayCircleIcon />
      <StopCircleIcon />
      <TimeCode length={length} />
      <ReplyCount count={replyCount} />
      <LiveCount count={liveListeners} />
    </div>
  );
};
