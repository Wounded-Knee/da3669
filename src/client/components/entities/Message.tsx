import React from 'react';

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
