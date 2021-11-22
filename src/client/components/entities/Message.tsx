import React from 'react';
import { Chat } from '@mui/icons-material';

export const Edit = () => {
  return <div>Message Editor</div>;
};

export const View = ({ entity }) => {
  return (
    <dl>
      <dt>Author</dt>
      <dd>{entity.text}</dd>
    </dl>
  );
};

export const icon = <Chat />;
