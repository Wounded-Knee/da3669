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

const Topic = ({ src, children, title }) => (
  <>
    <h1>{title}</h1>
    <img src={src} width='100%' />
    {children}
  </>
);

const VoiceNodes = () => (
  <ul
    css={css`
      list-style-type: none;
      padding: 0;
      margin: 0;
    `}
  >
    {[
      {
        props: {
          voiceNode: {
            src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fchordbook.com%2Fblog%2Fwp-content%2Fuploads%2F2015%2F02%2Fwaveform.jpg&f=1&nofb=1',
            length: 80000,
            x_spliceNodes: [1000, 8000, 40000],
            replyCount: 5,
            liveListeners: 1,
          },
        },
      },
      {
        props: {
          voiceNode: {
            length: 343853,
            src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvideos%2Fsound-wave-audio-waveform-spectrum-video-id897360804%3Fs%3D640x640&f=1&nofb=1',
            x_spliceNodes: [20000, 40000, 100000],
            replyCount: 1,
            liveListeners: 0,
          },
        },
      },
      {
        props: {
          voiceNode: {
            length: 34835,
            src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fvideos%2Fsound-wave-audio-waveform-spectrum-video-id897360804%3Fs%3D640x640&f=1&nofb=1',
            x_spliceNodes: [341, 599, 6000, 10000],
            replyCount: 3,
            liveListeners: 0,
          },
        },
      },
    ].map(({ props: { voiceNode: props } }, index) => (
      <li key={index}>
        <VoiceNode {...props} />
      </li>
    ))}
  </ul>
);

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
      {[
        {
          title: 'Covid',
          src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmicda.isr.umich.edu%2Fwp-content%2Fuploads%2F2020%2F05%2FGettyImages-1213090148-scaled.jpg&f=1&nofb=1',
        },
        {
          title: 'Joe Rogan',
          src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffreeread.causeaction.com%2Fwp-content%2Fuploads%2F2021%2F12%2Fjoe_rogan_podcast_ep-scaled-e1640794453403-1280x640.jpg&f=1&nofb=1',
        },
      ].map((props, index) => (
        <ul
          key={index}
          css={css`
            list-style-type: none;
            padding: 0;
            margin: 0;
          `}
        >
          <Topic {...props}>
            <VoiceNodes />
          </Topic>
        </ul>
      ))}
    </div>
  );
};
