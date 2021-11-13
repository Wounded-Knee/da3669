import React from 'react';
import { TYPE_ANSWER, TYPE_VOTE, TYPE_MESSAGE } from './data';
import { Answer } from './answer';
import { TextField } from './textfield-autosubmit';

export const Message = ({ message }) => {
  const { type, text, id, creatress, mother, messages } = message;
  if (type === TYPE_MESSAGE) {
    try {
      const { answers, answerVotedByCreatress } = message;
      if (answerVotedByCreatress) console.log('answer', answerVotedByCreatress.data);
    } catch (e) {
      console.error(e);
    }
  }
  const { name } = message.creatress;

  const Messages =
    type === TYPE_MESSAGE ? (
      <>
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </>
    ) : (
      ''
    );

  const Answers =
    typeof answers !== 'undefined' && type === TYPE_MESSAGE
      ? answers.map((answer, index) => <Answer key={index} answer={answer} />)
      : '';

  const ChosenAnswer =
    typeof answerVotedByCreatress !== 'undefined' ? <Message message={answerVotedByCreatress} /> : '';

  return (
    <>
      <dl onClick={() => console.log(message.data)}>
        <dt>{name}</dt>
        <dd>{text}</dd>
      </dl>
      {Messages}
      {ChosenAnswer}
      {Answers}
      <TextField onSubmit={(text) => message.answerText(text)} />
    </>
  );
};
