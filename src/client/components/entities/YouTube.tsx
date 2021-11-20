import React from 'react';
import ReactPlayer from 'react-player';

export const Edit = () => {
  return <div>YouTube Editor</div>;
};

export const View = ({ entity }) => {
  return <ReactPlayer url={`https://www.youtube.com/watch?v=${entity.videoId}`} />;
};
