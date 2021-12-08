/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import { useNode } from './useNode';
import { useParams } from 'react-router';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';

export const Index = ({ id, as = 'master' }) => {
  const [inputValue, setInputValue] = useState('');
  const propNodeId = id;
  const urlNodeId = useParams().nodeId;
  const nodeId = propNodeId || '' + urlNodeId;
  const { node } = useNode(nodeId);

  if (!node) return <Loading />;

  const { text = '', upstreams = [], downstreams = [] } = node;

  const onCommit = (value) => {
    console.log('User Commit ', value);
    setInputValue('');
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
          {upstreams.map(({ _id }, index) => (
            <Index key={index} as='upstream' id={_id} />
          ))}

          <View note='subject' node={node} />
        </>
      );

    case 'downstream':
      return <View note='downstream' node={node} />;

    default:
      return <div>Invalid view as {as}</div>;
  }
};

const View = ({ node, note }) => {
  const { text } = node;
  return <div title={note}>{text}</div>;
};

const Loading = () => {
  return <div>Loading...</div>;
};
