/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { connect } from 'react-redux';
import { useParams, Routes, Route } from 'react-router';

const mapStateToProps = (state) => ({
  nodes: state.nodes,
});

export const Bank = () => {
  const { nodeId } = useParams();

  return <h1>Bank</h1>;
};

export default connect(mapStateToProps)(Bank);
