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
import { Box } from '@mui/material';

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
    <Box
      css={css`
        flex-grow: 1;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
        justify-content: start;
        align-items: auto;
        align-content: start;

        &:before {
          display: block;
          content: ' ';
          flex: 999 999 auto;
        }
      `}
      sx={{
        padding: { xs: '1em', sm: '2em' },
      }}
    >
      <DisplayNode id={nodeId} note='Master' />

      <NodePicker
        nodeGenerator={nodePickerCreateNodeData}
        label='Reply'
        onPick={([{ _id }]) => navigate(`${urlPath}${_id}/`)}
      />
    </Box>
  ) : (
    <Directory />
  );
};

const getAuthorId = (node) => {
  return node && !!node.rel && !!node.rel.authors && node.rel.authors[0];
};
const DisplayNode = ({ id, note = '?' }) => {
  const nodeId = getNodeIdObject(id);
  const [node] = useNodes(['id', nodeId], 'DisplayNode');

  if (node) {
    const {
      rel: { upstreams },
    } = node;
    return (
      <>
        <DirectDisplayNode node={node} note={note} />
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
        {nodeId && nodeId.toString()}
      </div>
    );
  }
};

const Upstreams = ({ nodeIds }) => {
  const upstreams = useNodes(['ids', ...nodeIds], 'Upstreams');

  return (
    <>
      {upstreams.map((node, index) => {
        return (
          <React.Fragment key={index}>
            <Upstreams nodeIds={node.rel.upstreams} />
            <DirectDisplayNode node={node} />
          </React.Fragment>
        );
      })}
    </>
  );
};

const Downstreams = ({ parentId }) => {
  const downstreams = useNodes(['asRelation', parentId, 'upstreams'], 'Downstreams');
  return <DisplayNodes nodes={downstreams} note='Downstream' />;
};

const DisplayNodes = ({ nodes, note = '?' }) => {
  return nodes ? (
    <>
      {nodes.map((node) => (
        <>
          <DirectDisplayNode node={node} note={note} />
        </>
      ))}
    </>
  ) : (
    <div>...</div>
  );
};

const DirectDisplayNode = ({ node, note = '' }) => {
  const { text, _id } = node;
  const [user] = useNodes(['id', getAuthorId(node)]);

  return node ? (
    <div
      title={note}
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
        <DirectDisplayNode key={index} node={node} note='Directory' />
      ))}
    </>
  ) : (
    <div>...</div>
  );
};
