import React, { useReducer, useEffect } from 'react';
import { TextareaAutosize, Button } from '../../components/Branded';

const reducer = (document, { type, payload }) => {
  switch (type) {
    case 'UPDATED_TEXT':
      const newDocument = {
        ...document,
        text: payload,
      };
      return newDocument;
  }
};

export const Editor = ({ document: originalDocument, onChange }) => {
  const [document, dispatch] = useReducer(reducer, originalDocument || { text: '' });
  const { text, _id } = document;

  useEffect(() => {
    // Runs ONCE after initial rendering
    // and after every rendering ONLY IF `id` changes
    console.log('Document Changed ', document);
    onChange(document);
  }, [text]);

  return (
    <>
      {_id && <p>Doc ID {_id}</p>}
      <TextareaAutosize
        aria-label='Document Contents'
        placeholder='Empty'
        value={text}
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
