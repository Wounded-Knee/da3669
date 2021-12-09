/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import { useNodes } from './useNodes';
import { useParams } from 'react-router';
import { NodePicker } from './NodePicker';
import { getNonVirtualPathsByName } from '../../../shared/relations/all';
import { Link } from '../../components/Branded';

const nodeType = 'Message';
const upstreamPath = getNonVirtualPathsByName('stream');

export const Index = ({ id, as = 'master' }) => {
  const propNodeId = id;
  const urlNodeId = useParams().nodeId;
  const nodeId = propNodeId || urlNodeId;
  const { nodes, createNode, topLevelNodes } = useNodes([nodeId]);
  const [node] = nodes;

  if (!node || !nodeId)
    return (
      <>
        <NodePicker />

        {topLevelNodes.map((node, index) => (
          <div key={node._id}>
            <View node={node} />
          </div>
        ))}
      </>
    );

  const { text = '', parents = [], downstreams = [] } = node;

  console.info('Debug Index.tsx', {
    propNodeId,
    nodeId,
    node,
    downstreams,
  });

  switch (as) {
    case 'master':
      return (
        <>
          <Index as='upstream' id={nodeId} />

          <NodePicker />
        </>
      );

    case 'upstream':
      return (
        <>
          {parents.map(({ _id }, index) => (
            <Index key={index} as='upstream' id={_id} />
          ))}

          <View note='upstream' node={node} />
        </>
      );

    default:
      return <div>Invalid view as {as}</div>;
  }
};

const View = ({ node, note = '?' }) => {
  const { text, _id } = node;
  return (
    <Link to={`/experiment1/${_id}`} title={note}>
      {text}
    </Link>
  );
};

const Stalled = () => {
  return <div>Stalled...</div>;
};
