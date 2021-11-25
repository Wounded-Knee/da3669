import React, { useReducer, useEffect } from 'react';
import { TextareaAutosize, Button, Input } from '../../components/Branded';

export type Document = { text: string; title: string };
const emptyDocument = { text: '', title: '' };

const reducer = (document, { type, payload }) => {
  let newDocument;
  switch (type) {
    case 'UPDATED_TEXT':
      newDocument = {
        ...document,
        text: payload,
      };
      break;
    case 'UPDATED_TITLE':
      newDocument = {
        ...document,
        title: payload,
      };
      break;
  }
  return newDocument;
};

export const Editor = ({ document: originalDocument = emptyDocument, onChange }) => {
  const [document, dispatch] = useReducer(reducer, originalDocument);
  const { text, _id, title } = document;

  useEffect(() => {
    // Runs ONCE after initial rendering
    // and after every rendering ONLY IF `id` changes
    if (text || title) {
      onChange(document);
    }
  }, [text, title]);

  return (
    <>
      {_id ? <p>Doc ID {_id}</p> : <p>NO ID</p>}
      <Input
        value={title || ''}
        onChange={({ target: { value: title } }) => {
          return dispatch({ type: 'UPDATED_TITLE', payload: title });
        }}
      />
      <TextareaAutosize
        aria-label='Document Contents'
        placeholder='Empty'
        value={text || ''}
        onChange={({ target: { value: text } }) => {
          return dispatch({ type: 'UPDATED_TEXT', payload: text });
        }}
        style={{ width: 200 }}
      />
      <Button>Publish</Button>
      <Button>Delete</Button>
    </>
  );
};
