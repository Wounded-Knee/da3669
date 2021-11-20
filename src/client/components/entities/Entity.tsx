import React from 'react';
import ReactJson from 'searchable-react-json-view';

export const Edit = () => {
  return <div>Entity Editor</div>;
};

export const View = ({ entity }) => {
  return (
    <ReactJson
      displayObjectSize={false}
      displayDataTypes={false}
      enableClipboard={false}
      name={false}
      src={entity.data}
      theme='shapeshifter'
    />
  );
};
