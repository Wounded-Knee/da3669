import React from 'react';
import { useNode } from '../../lib/useNode';
import { TextareaAutosize, Button, Input } from '../../components/Branded';

export const defaultNode = {
  checkbox: false,
  text: '',
  title: '',
  kind: 'Document',
};

export const Editor = ({ node: propNode = defaultNode }) => {
  const [state, updatePath] = useNode(propNode);
  const { saved, persists, node } = state;
  const { text, title, checkbox } = node;

  return (
    <div style={{ width: '650px' }}>
      <h1>{title}</h1>
      <p>{text}</p>
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
          style={{ height: '20vh', width: '100%' }}
        />
      </div>
      <div>
        <input type='checkbox' checked={checkbox} onChange={() => updatePath('checkbox', !checkbox)} />
        {checkbox} {checkbox ? 'checked' : 'unchecked'}
      </div>

      <div>
        <span>{saved ? '' : 'un'}saved </span>
        <span>
          [ {persists.began.length} / {persists.finished.length} / {persists.error.length} ]
        </span>
      </div>
    </div>
  );
};
