import React from 'react';
import { TYPE_ANSWER, TYPE_VOTE } from './data';
import { Button } from '@material-ui/core';

export const Answer = ({ answer }) => {
  const { text, id, votes } = answer;
  const currentUserId = answer.core.user ? answer.core.user.id : undefined;
  const iVotedForThis =
    votes && currentUserId ? !!votes.find(({ creatressId }) => creatressId === currentUserId) : false;

  return (
    <Button variant={iVotedForThis ? 'outlined' : 'text'} onClick={() => answer.vote()}>
      {text} ({votes.length})
    </Button>
  );
};
