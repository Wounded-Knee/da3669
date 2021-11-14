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
    isSelected,
  } = message;

  let Messages = '',
    Answers = '',
    AnswerInput = '',
    ChosenAnswer = '';
  if (type === TYPE_MESSAGE) {
    const { answers, answerVotedByCreatress } = message;

    if (answerVotedByCreatress) {
      console.log('answer', answerVotedByCreatress.data);
      ChosenAnswer = <Message message={answerVotedByCreatress} />;
    }

    Messages = messages.map((message, index) => <Message key={index} message={message} />);

    AnswerInput = (
      <p title={text}>
        <TextField onSubmit={(text) => message.answerText(text)} />
      </p>
    );

    Answers =
      typeof answers !== 'undefined'
        ? answers.map((answer, index) => <Answer key={index} answer={answer} />)
        : 'Answers';
  }

  const MainMessage = (
    <dl onClick={() => message.core.ui.selectEntity(message.id)} className={isSelected ? 'selected' : ''}>
      <dt>{name}</dt>
      <dd>{text}</dd>
    </dl>
  );

  const AnswerText = console.log('Message ', message);

  return (
    <>
      {MainMessage}
      {Messages}
      {typeof answerChosenByCreatress === 'undefined' ? ChosenAnswer : Answers}
      {AnswerInput}
    </>
  );
};
