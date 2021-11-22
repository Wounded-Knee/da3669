import React from 'react';
import ImageIcon from '@mui/icons-material/Image';

export const Edit = () => {
  return <div>Image Editor</div>;
};

export const View = ({ entity }) => {
  return <img src={entity.src} alt={entity.text} />;
};

export const icon = <ImageIcon />;
