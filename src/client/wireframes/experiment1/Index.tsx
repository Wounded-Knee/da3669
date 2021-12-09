/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import { useNodes } from './useNodes';
import { useParams } from 'react-router';
import { NodePicker } from './NodePicker';
import { getNonVirtualPathsByName } from '../../../shared/relations/all';
import { Link } from '../../components/Branded';
import { useNavigate } from 'react-router-dom';

const nodeType = 'Message';
const upstreamPath = getNonVirtualPathsByName('stream');

export const Index = ({ id, as = 'master' }) => {
  const navigate = useNavigate();
  const propNodeId = id;
  const urlNodeId = useParams().nodeId;
  const nodeId = propNodeId || urlNodeId;
  const { nodes, createNode, topLevelNodes } = useNodes([nodeId]);
  const [node] = nodes;

  const navigateToNode = ({ _id }) => {
    const url = `/experiment1/${_id}/`;
    navigate(url, { replace: true });
  };

  if (!node || !nodeId)
    return (
      <>
        <NodePicker nodeType={nodeType} onPick={([node]) => navigateToNode(node)} />

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

          <NodePicker nodeType={nodeType} onPick={([node]) => navigateToNode(node)} />
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
