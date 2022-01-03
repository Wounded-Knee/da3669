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

export const VoiceNode = ({ src, length }) => {
  return (
    <div>
      <img
        width='100%'
        src={src}
        css={css`
          object-fit: cover;
          height: 66px;
        `}
      />
      <PlayCircleIcon />
      <StopCircleIcon />
      <TimeCode length={length} />
    </div>
  );
};
