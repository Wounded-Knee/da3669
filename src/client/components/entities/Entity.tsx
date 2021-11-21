import React from 'react';
import { JSON } from '../JSON';

export const Edit = () => {
  return <div>Entity Editor</div>;
};

export const View = ({ entity }) => {
  return <JSON data={entity.data} />;
};
