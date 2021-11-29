import React, { useReducer, useEffect, useState } from 'react';
import { TextareaAutosize, Button, Input } from '../../components/Branded';

const reducer = (document, { type, payload }) => {
  let newDocument;
  switch (type) {
    case 'CLOBBER':
      newDocument = payload;
      break;
    case 'UPDATED_ID':
      newDocument = {
        ...document,
        _id: payload,
      };
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

const emptyDocument = { text: '', title: '', kind: 'Document' };

export const Editor = ({ persist, document = emptyDocument }) => {
  const [thisDoc, dispatch] = useReducer(reducer, document);
  const [saved, setSaved] = useState(true);
  const { text, title } = thisDoc;

  const onChange = () => {
    if (!saved) {
      console.log('Persisting Editor Changes as ', thisDoc);
      persist(thisDoc).then((newDoc) => {
        setSaved(true);
        dispatch({ type: 'UPDATED_ID', payload: newDoc._id });
      });
    }
  };

  useEffect(() => {
    onChange();
  }, [text, title]);

  const updateValue = (name, event) => {
    const {
      target: { value: payload },
    } = event;
    setSaved(false);
    return dispatch({ type: `UPDATED_${name.toUpperCase()}`, payload });
  };

  return (
    <>
      <div>
        <Input
          placeholder='Title'
          value={title || ''}
          onChange={(event) => updateValue('TITLE', event)}
          style={{ color: '#fff', width: '100%' }}
        />
      </div>
      <div>
        <TextareaAutosize
          aria-label='Document Contents'
          placeholder='Empty'
          value={text || ''}
          onChange={(event) => updateValue('TEXT', event)}
          style={{ width: '90%', height: '50vh' }}
        />
      </div>
      <div>
        <Button onClick={onChange}>Publish</Button>
        <Button>Delete</Button>
      </div>
    </>
  );
};
