import React from 'react';
import ReactPlayer from 'react-player';
import { YouTube } from '@mui/icons-material';

export const Edit = () => {
  return <div>YouTube Editor</div>;
};

export const View = ({ entity }) => {
  return <ReactPlayer width='100%' height='100%' url={`https://www.youtube.com/watch?v=${entity.videoId}`} />;
};

export const icon = <YouTube />;
