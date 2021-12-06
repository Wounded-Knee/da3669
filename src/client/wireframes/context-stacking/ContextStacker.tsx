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

    case 'SET_HTML':
      const Wrapper = payload;
      const OldWrapper = state.html;
      const NewHTML = ({ children }) => (
        <Wrapper>
          <OldWrapper>{children}</OldWrapper>
        </Wrapper>
      );
      return {
        ...state,
        html: ({ children }) => <NewHTML>{children}</NewHTML>,
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
      var html = (props) => <div id='outer'>{props.children}</div>;
      newState = reducer(newState, { type: 'CHAT', payload: 'Yep!' });
      newState = reducer(newState, { type: 'SET_HTML', payload: html });
      break;
    case 12:
      var html = (props) => <div id='oopser'>{props.children}</div>;
      newState = reducer(newState, { type: 'SET_HTML', payload: html });
      break;
    case 23:
      newState = reducer(newState, { type: 'SET_TITLE', payload: 'Reduced Context' });
      break;
  }
  // @ts-ignore
  const { title, html: Html, text, recursionIndex, chatLog, recursionLimit } = newState;

  return (
    <>
      {recursionIndex < recursionLimit ? (
        <ContextStacker key={recursionIndex} state={newState} />
      ) : (
        <Html>
          <h1>{title}</h1>
          {chatLog.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </Html>
      )}
    </>
  );
};
