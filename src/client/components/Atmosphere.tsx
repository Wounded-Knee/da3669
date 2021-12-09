/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { getComponentByType } from './nodes/all';

const mapStateToProps = (state) => ({
  nodes: state.nodes,
});

const Message = getComponentByType('Message');

export const Atmosphere = () => {
  const { nodeId } = useParams();
  const navigate = useNavigate();

  const onCreate = ({ node: { _id } }) => {
    const url = `/atmosphere/${_id}/`;
    navigate(url, { replace: true });
  };

  return (
    <>
      <h1>Atmosphere</h1>
      {nodeId ? (
        <Message onCreate={onCreate} key={nodeId} mode='view' id={nodeId} />
      ) : (
        <Message mode='edit' onCreate={onCreate} />
      )}
    </>
  );
};

export default connect(mapStateToProps)(Atmosphere);
