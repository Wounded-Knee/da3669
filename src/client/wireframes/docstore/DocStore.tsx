/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { connect } from 'react-redux';
import { Editor } from './Editor';
import { persist, nodeList, getNodeById } from './actions';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Branded';
import { useParams, Routes, Route } from 'react-router';

const mapStateToProps = (state) => ({
  nodes: state.nodes,
});
const mapDispatchToProps = (dispatch) => ({
  fetchNodeList: () => dispatch(nodeList()),
  getNodeById: (nodeId) => dispatch(getNodeById(nodeId)),
  persist: (node) => dispatch(persist(node)),
});

export const DocStore = ({ nodeId: propNodeId, nodes, fetchNodeList, getNodeById, persist }) => {
  const { nodeId } = useParams();
  const thisNode = nodes.find(({ _id }) => _id === nodeId);
  const thisId = thisNode ? thisNode._id : undefined;

  useEffect(() => {
    fetchNodeList();
  }, []);

  useEffect(() => {
    if (nodeId) getNodeById(nodeId);
  }, [nodeId]);

  return (
    <div
      css={css`
        padding: 3em;
      `}
    >
      <h1>Doc Store</h1>
      <Editor key={thisId} persist={persist} document={thisNode} />
      {nodes.map((node, index) => (
        <div key={index}>
          <Link to={`/docstore/${node._id}`}>
            <Button>{node.title || node._id}</Button>
          </Link>
          <Editor key={node._id} node={node} />
        </div>
      ))}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DocStore);
