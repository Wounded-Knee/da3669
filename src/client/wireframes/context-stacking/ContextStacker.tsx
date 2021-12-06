/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_TITLE':
      return {
        ...state,
        title: payload,
      };

    case 'SET_TITLE_COLOR':
      return {
        ...state,
        titleColor: payload,
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
      var html = (props) => (
        <div id='oopser'>
          {text}
          {props.children}
        </div>
      );
      newState = reducer(newState, { type: 'SET_HTML', payload: html });
      newState = reducer(newState, { type: 'SET_TITLE_COLOR', payload: 'red' });
      break;
    case 15:
      newState = reducer(newState, { type: 'SET_TITLE_COLOR', payload: 'orange' });
      break;
    case 16:
      newState = reducer(newState, { type: 'SET_TITLE_COLOR', payload: 'yellow' });
      break;
    case 17:
      newState = reducer(newState, { type: 'SET_TITLE_COLOR', payload: 'green' });
      break;
    case 18:
      newState = reducer(newState, { type: 'SET_TITLE_COLOR', payload: 'cyan' });
      break;
    case 23:
      newState = reducer(newState, { type: 'SET_TITLE', payload: 'Reduced Context' });
      break;
  }
  // @ts-ignore
  const { title, html: Html, text, titleColor, recursionIndex, chatLog, recursionLimit } = newState;

  return (
    <>
      {recursionIndex < recursionLimit ? (
        <ContextStacker key={recursionIndex} state={newState} />
      ) : (
        <Html>
          <h1
            css={css`
              color: ${titleColor || 'white'};
            `}
          >
            {title}
          </h1>
          {chatLog.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </Html>
      )}
    </>
  );
};
