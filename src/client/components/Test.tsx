import React, { useState } from 'react';
import EntityCreate from './EntityCreate';

export const Test: React.FunctionComponent = ({ wsClient }) => {
  const [result, setResult] = useState(undefined);

  if (!result) {
    wsClient.call('beSilly').then(setResult).catch(wsClient.log);
  }

  return (
    <>
      {result ? <p>silly = {result.silly}</p> : <p>Loading</p>}
      <EntityCreate />
    </>
  );
};
