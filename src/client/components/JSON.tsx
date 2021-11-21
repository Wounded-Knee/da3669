import React from 'react';
import ReactJson from 'searchable-react-json-view';

export const JSON = ({ data }) => {
  return (
    <ReactJson
      displayObjectSize={false}
      displayDataTypes={false}
      enableClipboard={false}
      name={false}
      src={data}
      theme='shapeshifter'
    />
  );
};
