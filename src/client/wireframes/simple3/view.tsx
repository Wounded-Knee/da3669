import React, { useState } from 'react';
import { Message } from './message';

export const View = ({ messageID, core }) => {
  const message = core.getEntityById(messageID);

  return message ? (
    <div className='messages'>
      <Message message={message} />
    </div>
  ) : (
    <p>No Message</p>
  );
};
