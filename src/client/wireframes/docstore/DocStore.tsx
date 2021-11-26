/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { connect } from 'react-redux';
import { Editor } from './Editor';
import { setCurrentDoc, getCurrentDoc, nodeList } from './actions';
import { Link } from 'react-router-dom';
import { useParams, Routes, Route } from 'react-router';

const mapStateToProps = (state) => ({
  nodes: state.nodes,
});
const mapDispatchToProps = (dispatch) => ({
  fetchNodeList: () => dispatch(nodeList()),
});

export const DocStore = ({ nodes, fetchNodeList }) => {
  useEffect(() => {
    fetchNodeList();
  }, []);

  const DocList = () => {
    return (
      <>
        {nodes.map(({ _id }, index) => (
          <Link key={index} to={_id}>
            {_id}
          </Link>
        ))}
      </>
    );
  };

  return (
    <div
      css={css`
        padding: 3em;
      `}
    >
      <h1>Doc Store</h1>
      <Routes>
        <Route path='/' element={<DocList />} />
        <Route path='/:nodeId' element={<Editor onChange={console.log} />} />
      </Routes>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DocStore);
