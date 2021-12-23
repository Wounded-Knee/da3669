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
  variables: true,
  nodeId: false,
};

const {
  Types: { ObjectId },
} = mongoose;
const maxDepth = 3;
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
  const nodeId = getNodeIdObject(useParams().nodeId, id);
  if (debugNodeId(nodeId)) return <h1>Halted for NodeID debug</h1>;
  const { nodes } = useNodes(selectNodes(nodeId).populateRelation('downstreams'));
  const node = nodes.length > 0 && nodes[0];

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
    const upstreams = node.rel ? node.rel.upstreams || [] : [];
    const downstreams = node.rel ? node.rel.downstreams || [] : [];

    if (debug.variables)
      console.info('Debug Talk.tsx', {
        as,
        depth,
        nodeId: nodeId.toString(),
        node_id: node._id.toString(),
        node,
        downstreams: downstreams.map((id) => id.toString()),
        upstreams: upstreams.map((id) => id.toString()),
      });

    switch (as) {
      case viewType.MASTER:
        return (
          <>
            <Talk key={node._id.toString()} as={viewType.UPSTREAM} id={node._id.toString()} depth={depth+1} />

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
              <Talk key={_id.toString()} as={viewType.UPSTREAM} depth={depth + 1} id={_id.toString()} />
            ))}

            <View note={viewType.MASTER} node={node} />
            </>
        );

      default:
        return <div>Invalid view as {as}</div>;
    }
  } else if (nodeId) {
    return <></>;
  } else {
    return (
      <>
        {/*
        {topLevelNodes.map((node, index) => (
          <div key={node._id}>
            <View node={node} />
          </div>
        ))}*/}

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
