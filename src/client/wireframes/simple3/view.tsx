import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TYPE_ANSWER, TYPE_USER, TYPE_VOTE, TYPE_MESSAGE, data as initialData } from './data';
import { Message } from './message';
import { Button } from '@material-ui/core';

export const View = ({ messageID, core }) => {
  const message = core.getById(messageID);
  window.core = core;

  return (
    <div className='messages'>
      <Message message={message} />
    </div>
  );
};
