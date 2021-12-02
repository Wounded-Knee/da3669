/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { useNode } from '../../lib/useNode';
import { Input, Link } from '../Branded';

const nodeTypeName = 'Message';
export const defaultNode = {
  text: '',
  kind: nodeTypeName,
};

const Message = ({ mode = 'view', onCreate, node: propNode = defaultNode, relations = [] }) => {
  const [state, { updatePath, addRelation }] = useNode(propNode, relations);
  const { node, loaded, persists } = state;
  const { text, _id, upstreams } = node;

  useEffect(() => {
    if (persists.finished.length && onCreate) onCreate(state);
  }, [persists.finished]);

  switch (mode) {
    case 'view':
    case 'link':
      return (
        <>
          {/* Upstreams */}
          {upstreams && upstreams.length && <Message mode='link' node={{ _id: upstreams[0]._id }} />}

          {/* Content */}
          <Link to={`/atmosphere/${_id}/`}>{loaded ? text : '...'} </Link>

          {/* Reply Editor */}
          {mode !== 'link' && (
            <div title={mode}>
              <Message mode='edit' relations={[['upstream', _id]]} onCreate={onCreate} />
            </div>
          )}
        </>
      );
    case 'edit':
      return (
        <>
          <div>
            <Input onEnter={(value) => updatePath('text', value)} />
          </div>
        </>
      );
    default:
      return <p>Unknown mode {mode}</p>;
  }
};

export default {
  Component: Message,
};
