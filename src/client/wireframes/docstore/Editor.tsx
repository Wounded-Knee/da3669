import React, { useReducer, useEffect } from 'react';
import { TextareaAutosize, Button, Input } from '../../components/Branded';
import { useParams } from 'react-router';

export type Document = { text: string; title: string };
const emptyDocument = { text: '', title: '' };

const reducer = (document, { type, payload }) => {
  let newDocument;
  switch (type) {
    case 'CLOBBER':
      newDocument = payload;
      break;
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

/**
 *
 * Editor can load in two states
 * 1) Empty, fresh, no document.
 * 2) With document for edit
 */
export const Editor = ({ onChange: propsOnChange, document = emptyDocument }) => {
  const [thisDoc, dispatch] = useReducer(reducer, document);
  const { text, _id, title } = thisDoc;

  const onChange = () => {
    console.log('Persisting Editor Changes as ', thisDoc);
    propsOnChange(thisDoc).then((newDoc) => dispatch({ type: 'CLOBBER', payload: newDoc }));
  };

  useEffect(() => {
    console.log('Document has changed to ', document);
  }, [document]);

  useEffect(() => {
    console.log('ThisDoc has changed to ', thisDoc);
  }, [thisDoc]);

  useEffect(() => {
    if (text || title) {
      onChange();
    }
  }, [text, title]);

  return (
    <>
      {_id ? <p>Doc ID {_id}</p> : <p>NO ID</p>}
      <div>
        <Input
          value={title || ''}
          onChange={({ target: { value: title } }) => {
            return dispatch({ type: 'UPDATED_TITLE', payload: title });
          }}
        />
      </div>
      <div>
        <TextareaAutosize
          aria-label='Document Contents'
          placeholder='Empty'
          value={text || ''}
          onChange={({ target: { value: text } }) => {
            return dispatch({ type: 'UPDATED_TEXT', payload: text });
          }}
          style={{ width: 200 }}
        />
      </div>
      <div>
        <Button onClick={() => onChange()}>Publish</Button>
        <Button>Delete</Button>
      </div>
    </>
  );
};
