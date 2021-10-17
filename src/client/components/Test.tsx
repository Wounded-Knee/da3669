import React, { useState } from 'react';

export const Test: React.FunctionComponent = ({ wsClient }) => {
  const [result, setResult] = useState(undefined);
  wsClient.initialize().then(() => wsClient.call('beSilly').then(setResult));
  return <p>{result}</p>;
};
