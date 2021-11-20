import React from 'react';
import { TextField } from './textfield-autosubmit';
import { makeStyles } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectedMessage: {
      color: '#ff0',
    },
  }),
);

export const Message = ({ message }) => {
  const { type, text, id } = message;
  console.log(message);

  const classes = useStyles({});

  return (
    <>
      <dl>
        <dt>Author</dt>
        <dd>{text}</dd>
      </dl>
    </>
  );
};
