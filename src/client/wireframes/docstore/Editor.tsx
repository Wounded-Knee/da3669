import React from 'react';
import { useNode } from '../../lib/useNode';
import { TextareaAutosize, Button, Input } from '../../components/Branded';

export const defaultNode = {
  checkbox: false,
  text: '',
  title: '',
  kind: 'Document',
};

export const Editor = () => {
  const [state, updatePath] = useNode(defaultNode);
  const { saved, persists, node } = state;
  const { text, title, checkbox } = node;

  return (
    <>
      <h1>{title}</h1>
      <div>
        <Input
          placeholder='Title'
          value={title || ''}
          onChange={({ target: { value } }) => updatePath('title', value)}
          style={{ color: '#fff', width: '100%' }}
        />
      </div>
      <div>
        <TextareaAutosize
          aria-label='Document Contents'
          placeholder='Empty'
          value={text || ''}
          onChange={({ target: { value } }) => updatePath('text', value)}
          style={{ width: '90%', height: '50vh' }}
        />
      </div>
      <div>
        <input type='checkbox' checked={checkbox} onChange={() => updatePath('checkbox', !checkbox)} />
        {checkbox} {checkbox ? 'checked' : 'unchecked'}
      </div>

      <div>
        <Button>Publish</Button>
        <Button>Delete</Button>
        <span>{saved ? '' : 'not '} saved </span>
        <span>
          [ {persists.began.length} / {persists.finished.length} / {persists.error.length} ]
        </span>
      </div>
    </>
  );
};
