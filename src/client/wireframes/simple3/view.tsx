import React from 'react';
import { connect } from 'react-redux';
import { Message } from './message';

const mapStateToProps = (state) => {
  return {
    entities: state.entities,
  };
};

export const View = connect(mapStateToProps)(({ messageID, core }) => {
  const message = core.getEntityById(messageID);

  return message ? (
    <div className='messages'>
      <Message message={message} />
    </div>
  ) : (
    <p>No Message</p>
  );
});
