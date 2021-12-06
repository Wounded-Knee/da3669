import React from 'react';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_TITLE':
      return {
        ...state,
        title: payload,
      };

    case 'SET_TEXT':
      return {
        ...state,
        text: payload,
      };

    case 'CHAT':
      return {
        ...state,
        chatLog: [...state.chatLog, payload],
      };
  }
  return state;
};

export const ContextStacker = ({ state }) => {
  let newState = { ...state, recursionIndex: state.recursionIndex + 1 };
  switch (state.recursionIndex) {
    case 3:
      newState = reducer(newState, { type: 'SET_TITLE', payload: 'Hello, world!' });
      break;
    case 4:
      newState = reducer(newState, { type: 'CHAT', payload: 'Hahaha!' });
      break;
    case 6:
      newState = reducer(newState, { type: 'CHAT', payload: 'This is cool!' });
      break;
    case 9:
      newState = reducer(newState, { type: 'CHAT', payload: 'Yep!' });
      break;
  }
  // @ts-ignore
  const { title, text, recursionIndex, chatLog, recursionLimit } = newState;

  return (
    <>
      {recursionIndex < recursionLimit ? (
        <ContextStacker key={recursionIndex} state={newState} />
      ) : (
        <>
          <h1>{title}</h1>
          {chatLog.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </>
      )}
    </>
  );
};
