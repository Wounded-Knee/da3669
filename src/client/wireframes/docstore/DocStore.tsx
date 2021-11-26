/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { connect } from 'react-redux';
import { Editor } from './Editor';
import { setCurrentDoc, getCurrentDoc, nodeList } from './actions';
import { Button } from '../../components/Branded';

const mapStateToProps = (state) => ({
  currentDoc: getCurrentDoc(state),
  nodes: state.nodes,
});
const mapDispatchToProps = (dispatch) => ({
  setCurrentDoc: (document) => dispatch(setCurrentDoc(document)),
  fetchNodeList: () => dispatch(nodeList()),
});

export const DocStore = ({ currentDoc, setCurrentDoc, nodes, fetchNodeList }) => {
  const { _id } = currentDoc;

  useEffect(() => {
    fetchNodeList();
  }, []);

  return (
    <div
      css={css`
        padding: 3em;
      `}
    >
      <h1>Doc Store</h1>
      <Editor key={_id} document={currentDoc} onChange={setCurrentDoc} />
      {nodes.map(({ _id }, index) => (
        <Button key={index}>{_id}</Button>
      ))}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DocStore);
