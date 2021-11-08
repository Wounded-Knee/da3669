import React from 'react';
import { Votes } from './Votes';

const voteData = [
  {
    rubricId: 3,
    userId: 1,
    confidence: 5,
    date: new Date(),
  },
  {
    rubricId: 3,
    userId: 2,
    confidence: 10,
    date: new Date(),
  },
];

export const Screen1: React.FunctionComponent = () => {
  return (
    <>
      <h1>Rubric X applied to Statement Y</h1>
      <Votes data={voteData} />
    </>
  );
};
