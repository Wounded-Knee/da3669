import React from 'react';
import { selectNodes } from '../lib/NodeSelector';
import { useNodes } from '../lib/useNodes';

export const Directory: React.FunctionComponent = () => {
  const { nodes } = useNodes(selectNodes().lacksRelation('upstream'));
  console.log('Top-Level Nodes: ', nodes);

  return <h1>Directory</h1>;
};
