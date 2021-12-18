import React from 'react';
import { selectNodes } from '../lib/NodeSelector';
import { useNodes } from '../lib/useNodes';

export const Directory = (): JSX.Element => {
  const { nodes } = useNodes(selectNodes().andTop().andRelations('downstreams'));
  console.log('Top-Level Nodes: ', nodes);
  return <h1>Directory</h1>;
};
