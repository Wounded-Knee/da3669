import React from 'react';
import { useNode } from '../../lib/useNode';
import { Input } from '../Branded';

const nodeTypeName = 'Message';
export const defaultNode = {
  text: '',
  kind: nodeTypeName,
};

const Message = ({ mode = 'view', node: propNode = defaultNode, relations = [] }) => {
  const [state, { updatePath, addRelation }] = useNode(propNode, relations);
  const { node, loaded } = state;
  const { text } = node;

  switch (mode) {
    case 'view':
      return (
        <>
          <div>{loaded ? text : 'Loading...'}</div>
        </>
      );
    case 'edit':
      return (
        <>
          <div>
            <Input onEnter={(value) => updatePath('text', value)} />
          </div>
        </>
      );
    default:
      return <p>Unknown mode ${mode}</p>;
  }
};

export default {
  Component: Message,
};
