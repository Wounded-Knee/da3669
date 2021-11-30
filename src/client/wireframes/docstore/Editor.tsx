import React, { useReducer, useEffect, useCallback } from 'react';
import { debounce } from 'debounce';
import { TextareaAutosize, Button, Input } from '../../components/Branded';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'ERROR_PERSIST':
      return {
        ...state,
        persists: {
          ...state.persists,
          error: [new Date(), ...state.persists.error],
        },
      };

    case 'BEGAN_PERSIST':
      return {
        ...state,
        persists: {
          ...state.persists,
          began: [new Date(), ...state.persists.began],
        },
      };

    case 'FINISHED_PERSIST':
      const { _id, createdAt, updatedAt, __v } = payload;
      return {
        ...state,
        saved: true,
        persists: {
          ...state.persists,
          finished: [new Date(), ...state.persists.finished],
        },
        node: {
          ...state.node,
          _id,
          createdAt,
          updatedAt,
          __v,
        },
      };

    case 'UPDATED_TEXT':
      return {
        ...state,
        saved: false,
        node: {
          ...state.node,
          text: payload,
        },
      };

    case 'UPDATED_TITLE':
      return {
        ...state,
        saved: false,
        node: {
          ...state.node,
          title: payload,
        },
      };
  }
};

const emptyDocument = { text: '', title: '', kind: 'Document' };
const defaultState = {
  persists: {
    began: [],
    finished: [],
    error: [],
  },
  saved: true,
  node: {
    text: '',
    title: '',
    kind: 'Document',
  },
};

export const Editor = ({ persist, node: propNode = defaultState.node }) => {
  const [state, dispatch] = useReducer(reducer, { ...defaultState, node: propNode });
  const { saved, persists, node } = state;
  const { text, title } = node;

  const onChange = useCallback(
    debounce(() => {
      // Don't persist until these conditions are met...
      // Don't persist again until the first persist has completed or you will create multiple nodes...
      // First persist is special.
      const persistInProgress = persists.began > persists.finished.length + persists.error.length;
      const doPersist = !saved && !persistInProgress;
      if (doPersist) {
        if (!persistInProgress) {
          console.log('Persisting Editor Changes as ', node);
          dispatch({ type: 'BEGAN_PERSIST', payload: undefined });
          persist(node)
            .then((node) => {
              dispatch({ type: 'FINISHED_PERSIST', payload: node });
            })
            .catch(() => {
              dispatch({ type: 'ERROR_PERSIST', payload: undefined });
            });
        } else {
          console.log('Persist already in progress... ', persists);
        }
      } else {
        console.log('Not persisting', doPersist, saved, persistInProgress);
      }
    }, 250),
    [saved],
  );

  useEffect(() => {
    onChange();
  }, [text, title]);

  const updateValue = (name, event) => {
    const {
      target: { value: payload },
    } = event;
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
        <span>{saved ? '' : 'not '} saved </span>
        <span>
          [ {persists.began.length} / {persists.finished.length} / {persists.error.length} ]
        </span>
      </div>
    </>
  );
};
