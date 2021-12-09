/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import { useNode } from './useNode';
import { useParams } from 'react-router';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import { getNonVirtualPathsByName } from '../../../shared/relations/all';
import { Link } from '../../components/Branded';

const nodeType = 'Message';
const upstreamPath = getNonVirtualPathsByName('stream');

export const Index = ({ id, as = 'master' }) => {
  const [inputValue, setInputValue] = useState('');
  const propNodeId = id;
  const urlNodeId = useParams().nodeId;
  const nodeId = propNodeId || urlNodeId;
  const { node, createNode, topLevelNodes } = useNode(nodeId);

  if (!node || !nodeId)
    return (
      <>
        {topLevelNodes.map((node, index) => (
          <div key={node._id}>
            <View node={node} />
          </div>
        ))}
      </>
    );

  const { text = '', parents = [], downstreams = [] } = node;

  const onCommit = (value) => {
    console.log('User Commit ', value);
    setInputValue('');
    createNode({
      text: value,
      kind: nodeType,
      [upstreamPath]: nodeId ? [nodeId] : [],
    });
  };

  console.info('Debug Index.tsx', {
    propNodeId,
    nodeId,
    node,
    inputValue,
    downstreams,
  });

  switch (as) {
    case 'master':
      return (
        <>
          <Index as='upstream' id={nodeId} />

          <Autocomplete
            freeSolo
            id='downstreamSelector'
            disableClearable
            autoComplete
            autoSelect
            onKeyDown={({ key }) => key === 'Enter' && onCommit(inputValue)}
            inputValue={inputValue}
            onInputChange={(event, value) => setInputValue(value)}
            options={downstreams}
            getOptionLabel={(option) => option.text || option}
            isOptionEqualToValue={({ text }, value) =>
              value.toLowerCase ? value.toLowerCase() === text.toLowerCase() : false
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label='Reply'
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
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
