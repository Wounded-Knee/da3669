import React from 'react';
import { TYPE_ANSWER, TYPE_VOTE, TYPE_MESSAGE } from './data';
import { Answer } from './answer';
import { TextField } from './textfield-autosubmit';

export const Message = ({ message }) => {
  const {
    type,
    text,
    id,
    creatress: { name },
    mother,
    messages,
  } = message;

  let Messages = '',
    Answers = '',
    ChosenAnswer = '';
  if (type === TYPE_MESSAGE) {
    const { answers, answerVotedByCreatress } = message;

    if (answerVotedByCreatress) {
      console.log('answer', answerVotedByCreatress.data);
      const ChosenAnswer =
        typeof answerVotedByCreatress !== 'undefined' ? <Message message={answerVotedByCreatress} /> : 'ChosenAnswer';
    }

    Messages = messages.map((message, index) => <Message key={index} message={message} />);

    Answers =
      typeof answers !== 'undefined'
        ? answers.map((answer, index) => <Answer key={index} answer={answer} />)
        : 'Answers';
  }

  const MainMessage = (
    <dl onClick={() => console.log(message.data)}>
      <dt>{name}</dt>
      <dd>{text}</dd>
    </dl>
  );

  return (
    <>
      {MainMessage}
      {Messages}
      {ChosenAnswer}
      {Answers}
      <TextField onSubmit={(text) => message.answerText(text)} />
    </>
  );
};
