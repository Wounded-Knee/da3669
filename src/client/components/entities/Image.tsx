import React from 'react';

export const Edit = () => {
  return <div>Image Editor</div>;
};

export const View = ({ entity }) => {
  return <img src={entity.src} alt={entity.text} />;
};
