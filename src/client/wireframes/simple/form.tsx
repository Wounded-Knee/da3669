import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';

const Input = (props) => {
  const [form, setForm] = props.formState;
  const onChange = (event, ...args) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };
  return <TextField {...props} onChange={onChange} />;
};

export const Form = (props) => {
  const { mother, comment, question, ifno, ifyes, preview, onSubmit } = props;
  const formState = useState({
    quasiBoolean: null,
  });
  const [form, setForm] = formState;

  console.log(preview, form);

  const setYesNo = (bool) =>
    setForm({
      ...form,
      quasiBoolean: bool,
    });

  const { quasiBoolean } = form;

  return (
    <>
      <p>{comment}</p>
      <h1>{question}</h1>

      {quasiBoolean === null || preview ? (
        <>
          <Button variant={quasiBoolean === true ? 'outlined' : 'text'} onClick={() => setYesNo(true)}>
            Yes
          </Button>
          <Button variant={quasiBoolean === false ? 'outlined' : 'text'} onClick={() => setYesNo(false)}>
            No
          </Button>
        </>
      ) : (
        ''
      )}

      {quasiBoolean !== null ? (
        <>
          <p>
            {preview ? '<' : '>'} {quasiBoolean ? 'yes' : 'no'}
          </p>
          <p>{quasiBoolean ? ifyes : ifno}</p>
          {!preview ? (
            <Form preview ifyes={form.ifyes} ifno={form.ifno} onSubmit={(...args) => console.log(args)} />
          ) : (
            ''
          )}
        </>
      ) : (
        ''
      )}

      {!preview ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(form, event);
          }}
        >
          <fieldset>
            <label>Parent ID</label>
            <Input name='mother' formState={formState} />
          </fieldset>
          <fieldset>
            <label>Comment</label>
            <Input name='comment' formState={formState}></Input>
          </fieldset>
          <fieldset>
            <label>Yes/No Question</label>
            <Input name='question' formState={formState} />
          </fieldset>
          <fieldset>
            <label>If Yes</label>
            <Input name='ifyes' formState={formState} />
          </fieldset>
          <fieldset>
            <label>If NO</label>
            <Input name='ifno' formState={formState} />
          </fieldset>

          <fieldset>
            <input type='submit' />
          </fieldset>
        </form>
      ) : (
        ''
      )}
    </>
  );
};
