/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx } from '@emotion/react';
import { useNodes } from '../lib/useNodes';
import { useParams } from 'react-router';
import { NodePicker } from './NodePicker';
import { Link } from './Branded';
import { useNavigate } from 'react-router-dom';
import mongoose from 'mongoose';
import { PassportContext } from './PassportContext';

const debug = {
  variables: true,
  nodeId: false,
};

const {
  Types: { ObjectId },
} = mongoose;
const urlPath = `/talk/`;
const nodeType = 'Message';

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

export const Talk = (): JSX.Element => {
  const nodeId = getNodeIdObject(useParams().nodeId);
  const { _id: userId } = useContext(PassportContext);
  const navigate = useNavigate();
  const nodePickerCreateNodeData = (value) => ({
    kind: nodeType,
    text: value,
    rel: {
      ['upstreams']: [nodeId],
      ['authors']: [userId],
    },
  });

  return nodeId ? (
    <>
      <DisplayNode id={nodeId} />

      <NodePicker
        nodeGenerator={nodePickerCreateNodeData}
        label='Reply'
        onPick={([{ _id }]) => navigate(`${urlPath}${_id}/`)}
      />
    </>
  ) : (
    <Directory />
  );
};

const getAuthorId = (node) => {
  return node && !!node.rel && !!node.rel.authors && node.rel.authors[0];
};
const DisplayNode = ({ id, note = '?' }) => {
  const nodeId = getNodeIdObject(id);
  const [node] = useNodes(['id', nodeId]);

  if (node) {
    const {
      rel: { upstreams, downstreams },
    } = node;
    return (
      <>
        {upstreams.map((upstreamId, index) => (
          <DisplayNode key={index} id={upstreamId} />
        ))}

        <DirectDisplayNode node={node} />

        {downstreams.map((downstreamId, index) => (
          <DisplayNode key={index} id={downstreamId} />
        ))}
      </>
    );
  } else {
    return (
      <div
        title='Node Not Found'
        css={css`
          color: #444;
        `}
      >
        {nodeId.toString()}
      </div>
    );
  }
};

const DirectDisplayNode = ({ node }) => {
  const { text, _id } = node;
  const [user] = useNodes(['id', getAuthorId(node)]);

  return node ? (
    <div
      css={css`
        color: #666;
      `}
    >
      {user && `${user.name}: `}
      <Link to={`${urlPath}${_id}/`}>{text}</Link>
    </div>
  ) : (
    <div>?</div>
  );
};

const Directory = () => {
  const topLevelNodes = useNodes(['lacksRelation', 'upstreams']);
  return topLevelNodes ? (
    <>
      {topLevelNodes.map((node, index) => (
        <DirectDisplayNode key={index} node={node} />
      ))}
    </>
  ) : (
    <div>...</div>
  );
};
