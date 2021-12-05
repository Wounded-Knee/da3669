// @ts-nocheck
/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { Editor } from './Editor';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Branded';
import AtmosphereIcon from '@mui/icons-material/Language';

export const NodeManager = () => {
  useEffect(() => {
    //fetchNodeList();
  }, []);

  useEffect(() => {
    //if (nodeId) getNodeById(nodeId);
  }, [nodeId]);

  return (
    <>
      <h1>Node Manager</h1>
      <Editor />
      {nodes.map((node, index) => (
        <div key={index}>
          <Link to={`/atmosphere/${node._id}`}>
            <Button>
              <AtmosphereIcon /> {node.title || node.text || node._id}
            </Button>
          </Link>
          <Editor key={node._id} id={node._id} />
        </div>
      ))}
    </>
  );
};

export default NodeManager;
