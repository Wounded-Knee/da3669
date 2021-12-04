/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { useNode } from '../../lib/useNode';
import { Input, Link } from '../Branded';

const nodeTypeName = 'Message';
const defaultNode = {
  // Todo: Move this to shared node config or read it from there
  text: '',
  kind: nodeTypeName,
};

const Message = ({ mode = 'view', onCreate = (state) => {}, node: propNode = defaultNode, relations = [] }) => {
  const [state, { updatePath, addRelation }] = useNode(propNode, relations);
  const { node, loaded, persists } = state;
  const { text, _id } = node;

  const Relations = ({ type }) => {
    let relations = [];
    switch (type) {
      case 'upstream':
        relations = node['upstreams'] || relations;
        break;
      case 'downstream':
        relations = node['downstreams'] || relations;
        break;
    }
    return (
      <>
        {relations.map((relation, index) => {
          return (
            <div key={index}>
              <Message mode={type} node={relation} />
            </div>
          );
        })}
      </>
    );
  };

  const Reply = () => {
    return (
      <div title={mode}>
        <Message mode='edit' relations={[['stream', _id]]} onCreate={onCreate} />
      </div>
    );
  };

  const LinkedSelf = () => {
    return (
      <Link title={_id} to={`/atmosphere/${_id}/`}>
        {loaded ? text : '...'}{' '}
      </Link>
    );
  };

  useEffect(() => {
    if (persists.finished.length && onCreate) onCreate(state);
  }, [persists.finished]);

  switch (mode) {
    case 'view':
      return (
        <>
          <Relations type='upstream' />
          <LinkedSelf />
          <Reply />
          <Relations type='downstream' />
        </>
      );

    case 'upstream':
      return (
        <>
          <Relations type='upstream' />
          <LinkedSelf />
        </>
      );

    case 'downstream':
      return <LinkedSelf />;

    case 'edit':
      return (
        <div>
          <Input onEnter={(value) => updatePath('text', value)} />
        </div>
      );

    default:
      return <p>Unknown mode {mode}</p>;
  }
};

export default {
  Component: Message,
};
