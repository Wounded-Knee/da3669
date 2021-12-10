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

const maxDepth = 10;
const debug = {
  variables: false,
};
const urlPath = `/experiment1/`;
const nodeType = 'Message';
const upstreamPath = getNonVirtualPathsByName('stream');

export const Index = ({ id, as = 'master', depth = 0 }) => {
  const navigate = useNavigate();
  const propNodeId = id;
  const urlNodeId = useParams().nodeId;
  const nodeId = propNodeId || urlNodeId;
  const nodeIdArray = nodeId ? [nodeId] : [];
  const { nodes, topLevelNodes } = useNodes(nodeIdArray);
  const [node] = nodes;

  const nodePickerCreateNodeData = (value) => ({
    kind: nodeType,
    text: value,
    [upstreamPath]: nodeIdArray,
  });

  const navigateToNode = ({ _id }) => {
    const url = `${urlPath}${_id}/`;
    navigate(url);
  };

  if (depth >= maxDepth) {
    return <div>Max Depth Reached</div>;
  }

  if (!node || !nodeId) {
    return (
      <>
        <NodePicker label='Speak' nodeGenerator={nodePickerCreateNodeData} onPick={([node]) => navigateToNode(node)} />

        {topLevelNodes.map((node, index) => (
          <div key={node._id}>
            <View node={node} />
          </div>
        ))}
      </>
    );
  }

  const { text = '', upstreams = [], downstreams = [] } = node;

  if (debug.variables)
    console.info('Debug Index.tsx', {
      as,
      propNodeId,
      nodeId,
      node,
      downstreams,
    });

  switch (as) {
    case 'master':
      return (
        <>
          <Index key={nodeId} as='upstream' depth={depth + 1} id={nodeId} />

          <NodePicker
            nodeGenerator={nodePickerCreateNodeData}
            label='Reply'
            options={downstreams}
            onPick={([node]) => navigateToNode(node)}
          />
        </>
      );

    case 'upstream':
      return (
        <>
          {upstreams.map((_id, index) => (
            <Index key={_id} as='upstream' depth={depth + 1} id={_id} />
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
    <Link to={`${urlPath}${_id}/`} title={note}>
      {text}
    </Link>
  );
};
