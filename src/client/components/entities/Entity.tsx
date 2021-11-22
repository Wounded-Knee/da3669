import React from 'react';
import { JSON } from '../JSON';
import { ChatBubbleOutline } from '@mui/icons-material';

export const Edit = () => {
  return <div>Entity Editor</div>;
};

export const View = ({ entity }) => {
  return <JSON data={entity.data} />;
};

export const icon = <ChatBubbleOutline />;
