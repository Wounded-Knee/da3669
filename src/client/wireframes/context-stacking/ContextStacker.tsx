import React from 'react';

export const initialState = {
  text: 'Untitled',
  chatLog: [],
  recursionIndex: 0,
  recursionLimit: 50,
};

const reducer = (state = initialState, { type, payload }) => {
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

const dispatch = (state, action) => reducer(state, action);

export const ContextStacker = ({ state = initialState }) => {
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
