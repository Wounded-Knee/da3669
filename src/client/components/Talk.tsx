/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx } from '@emotion/react';
import { useNodes } from '../lib/useNodes';
import { useParams } from 'react-router';
import { NodePicker } from './NodePicker';
import { selectNodes } from '../lib/redux/selectors';
import { Link } from './Branded';
import { useNavigate } from 'react-router-dom';
import mongoose from 'mongoose';
import { PassportContext } from './PassportContext';
import { NodeId } from '../../shared/all';

const debug = {
  variables: false,
  nodeId: false,
};

const {
  Types: { ObjectId },
} = mongoose;
const maxDepth = 10;
const urlPath = `/talk/`;
const nodeType = 'Message';
const viewType = Object.freeze({
  MASTER: 'MASTER',
  UPSTREAM: 'UPSTREAM',
  DOWNSTREAM: 'DOWNSTREAM',
});

const getNodeIdObject = (...candidates) =>
  candidates.reduce((id, candidateId) => (ObjectId.isValid(candidateId) ? new ObjectId(candidateId) : id), undefined);

const debugNodeId = (nodeId) => {
  if (debug.nodeId) {
    if (nodeId) {
      console.log('Node ID ', nodeId.toString());
    } else {
      console.log('No node ID');
    }
    return true;
  }
};

export const Talk = ({
  id,
  as = viewType.MASTER,
  depth = 0,
}: {
  id: NodeId;
  as: string;
  depth: number;
}): JSX.Element => {
  if (depth >= maxDepth) {
    return <div>Max Depth Reached</div>;
  }

  const userProfile = useContext(PassportContext);
  const navigate = useNavigate();
  const nodeId = getNodeIdObject(id, useParams().nodeId);
  if (debugNodeId(nodeId)) return <h1>Halted for NodeID debug</h1>;
  const node = nodeId && useNodes(selectNodes(nodeId)).nodes[0];
  const { nodes: topLevelNodes } = useNodes(selectNodes().lacksRelation('upstream'));

  const nodePickerCreateNodeData = (value) => ({
    kind: nodeType,
    text: value,
    rel: {
      ['upstreams']: [nodeId],
      ['authors']: [userProfile._id],
    },
  });

  const navigateToNode = ({ _id }) => {
    const url = `${urlPath}${_id}/`;
    navigate(url);
  };

  if (nodeId && node) {
    const {
      rel: { upstreams = [], downstreams = [] },
    } = node;

    if (debug.variables)
      console.info('Debug Talk.tsx', {
        as,
        nodeId,
        node,
        downstreams,
      });

    switch (as) {
      case viewType.MASTER:
        return (
          <>
            <Talk key={nodeId} as={viewType.UPSTREAM} depth={depth + 1} id={nodeId} />

            <NodePicker
              nodeGenerator={nodePickerCreateNodeData}
              label='Reply'
              options={downstreams}
              onPick={([node]) => navigateToNode(node)}
            />

            {downstreams.map((_id) => (
              <Talk key={_id} as={viewType.DOWNSTREAM} id={_id} depth={depth + 1} />
            ))}
          </>
        );

      case viewType.DOWNSTREAM:
        return <View note={viewType.DOWNSTREAM} node={node} />;

      case viewType.UPSTREAM:
        return (
          <>
            {upstreams.map((_id, index) => (
              <Talk key={_id} as={viewType.UPSTREAM} depth={depth + 1} id={_id} />
            ))}

            <View note={viewType.UPSTREAM} node={node} />
          </>
        );

      default:
        return <div>Invalid view as {as}</div>;
    }
  } else if (nodeId) {
    return <h1>Loading</h1>;
  } else {
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
};

const View = ({ node, note = '?' }) => {
  const { text, _id } = node;
  return (
    <Link to={`${urlPath}${_id}/`} title={note}>
      {text}
    </Link>
  );
};
