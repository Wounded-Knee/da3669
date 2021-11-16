import React, { useState } from 'react';
import { Message } from './message';

export const View = ({ messageID, core }) => {
  const message = core.getById(messageID);
  // @ts-ignore
  if (window) window.core = core;

  return (
    <div className='messages'>
      <Message message={message} />
    </div>
  );
};
