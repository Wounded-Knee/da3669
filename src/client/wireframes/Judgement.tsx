import React from 'react';
import { Votes } from './Votes';

export const Judgement: React.FunctionComponent = ({ data }) => {
  return (
    <>
      <h1>Judgement</h1>
      <Votes
        filter={({ rubricId }) => rubricId === 3}
        data={[
          {
            rubricId: 3,
            userId: 1,
            confidence: 0.4,
            date: new Date(),
          },
          {
            rubricId: 3,
            userId: 2,
            confidence: -0.1,
            date: new Date(),
          },
        ]}
      />
    </>
  );
};
