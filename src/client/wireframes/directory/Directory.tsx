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
import { VoiceNode } from './VoiceNode';

export const Directory = () => {
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
      <ul
        css={css`
          list-style-type: none;
          padding: 0;
          margin: 0;
        `}
      >
        {[
          {
            src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fchordbook.com%2Fblog%2Fwp-content%2Fuploads%2F2015%2F02%2Fwaveform.jpg&f=1&nofb=1',
            length: 80000,
          },
          {
            length: 343853,
            src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvideos%2Fsound-wave-audio-waveform-spectrum-video-id897360804%3Fs%3D640x640&f=1&nofb=1',
          },
          {
            length: 34835,
            src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvideos%2Fsound-wave-audio-waveform-spectrum-video-id897360804%3Fs%3D640x640&f=1&nofb=1',
          },
        ].map(({ length, src }, index) => (
          <li key={index}>
            <VoiceNode length={length} src={src} />
          </li>
        ))}
      </ul>
    </div>
  );
};
