import React, { useState } from 'react';

export const Test: React.FunctionComponent = ({ wsClient }) => {
  const [result, setResult] = useState(undefined);

  wsClient.initialize().then(() => {
    console.log('Requet');
    wsClient.call('beSilly').then((result) => {
      console.log('Result ', result);
      setResult(result);
    });
  });

  return <p>{result}</p>;
};
