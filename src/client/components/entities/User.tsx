import React from 'react';

export const Edit = () => {
  return <div>User Editor</div>;
};

export const View = ({ entity }) => {
  return <p>User: { entity.name }</p>;
};
