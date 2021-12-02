/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { connect } from 'react-redux';
import { useParams, Routes, Route } from 'react-router';
import { getComponentByType } from './nodes/all';

const mapStateToProps = (state) => ({
  nodes: state.nodes,
});

export const Atmosphere = () => {
  const { nodeId } = useParams();
  const Component = getComponentByType('Message');

  return (
    <>
      <h1>Atmosphere</h1>
      <Component mode='edit' />
    </>
  );
};

export default connect(mapStateToProps)(Atmosphere);
