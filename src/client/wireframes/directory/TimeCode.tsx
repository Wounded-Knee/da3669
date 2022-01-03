/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx } from '@emotion/react';
import { timecode } from 'simple-timecode';

export const TimeCode = ({ length }) => {
  return timecode.MillisecondsToTime(length);
};
