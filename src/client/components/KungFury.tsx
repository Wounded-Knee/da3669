import React from 'react';
import ReactPlayer from 'react-player/dailymotion';

const url = 'https://www.dailymotion.com/video/x2s5rnp';
export const KungFury = () => {
  return (
    <ReactPlayer
      url={url}
      config={{
        fullscreen: true,
        autoplay: true,
      }}
      width='100%'
      playing={true}
    />
  );
};
