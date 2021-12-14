/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { useNodes } from '../lib/useNodes';
import { useParams } from 'react-router';
import { NodePicker } from './NodePicker';
import { selectNodes } from '../lib/redux/selectors';
import { Link } from './Branded';
import { useNavigate } from 'react-router-dom';
import { Types } from 'mongoose';

const maxDepth = 10;
const debug = {
  variables: false,
};
const urlPath = `/talk/`;
const nodeType = 'Message';

export const Talk = ({ id, as = 'master', depth = 0 }) => {
  const navigate = useNavigate();
  const propNodeId = id;
  const urlNodeId = useParams().nodeId;
  const nodeId = propNodeId || urlNodeId;
  const nodeIdArray = nodeId ? [nodeId] : [];
  const { nodes, topLevelNodes } = useNodes(selectNodes(...nodeIdArray).andRelations('downstreams'));
  const [node] = nodes;

  const nodePickerCreateNodeData = (value) => ({
    kind: nodeType,
    text: value,
    rel: {
      ['upstreams']: nodeIdArray.map((id) => new Types.ObjectId(id)),
    },
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
        {topLevelNodes.map((node, index) => (
          <div key={node._id}>
            <View node={node} />
          </div>
        ))}

        <NodePicker label='Speak' nodeGenerator={nodePickerCreateNodeData} onPick={([node]) => navigateToNode(node)} />
      </>
    );
  }

  const {
    text = '',
    rel: { upstreams = [], downstreams = [] },
  } = node;

  if (debug.variables)
    console.info('Debug Talk.tsx', {
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
          <Talk key={nodeId} as='upstream' depth={depth + 1} id={nodeId} />

          <NodePicker
            nodeGenerator={nodePickerCreateNodeData}
            label='Reply'
            options={downstreams}
            onPick={([node]) => navigateToNode(node)}
          />

          {downstreams.map(({ _id }) => (
            <Talk key={_id} as='downstream' id={_id} />
          ))}
        </>
      );

    case 'downstream':
      return <View note='downstream' node={node} />;

    case 'upstream':
      return (
        <>
          {upstreams.map((_id, index) => (
            <Talk key={_id} as='upstream' depth={depth + 1} id={_id} />
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
