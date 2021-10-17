import React, { useState } from 'react';

export const Test: React.FunctionComponent = ({ wsClient }) => {
  const [result, setResult] = useState(undefined);

  if (!result) {
    wsClient.initialize().then(() => {
      wsClient
        .call('beSilly')
        .then((result) => {
          setResult(result);
        })
        .catch(wsClient.log);
    });
  }

  return result ? <p>silly = {result.silly}</p> : <p>Loading</p>;
};
