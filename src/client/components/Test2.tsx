import React, { useState } from 'react';

export const Test2: React.FunctionComponent = ({ wsClient }) => {
  const [result, setResult] = useState(undefined);

  if (!result) {
    wsClient.call('beSilly', 1, 2, 3).then(setResult).catch(wsClient.log);
  }

  return result ? <p>silly = {result.silly}</p> : <p>Loading</p>;
};
