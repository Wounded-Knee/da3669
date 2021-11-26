/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { connect } from 'react-redux';
import { Editor } from './Editor';
import { setCurrentDoc, getCurrentDoc } from './actions';

const mapStateToProps = (state) => ({
  currentDoc: getCurrentDoc(state),
});
const mapDispatchToProps = (dispatch) => ({
  setCurrentDoc: (document) => dispatch(setCurrentDoc(document)),
});

export const DocStore = ({ currentDoc, setCurrentDoc }) => {
  const { _id } = currentDoc;

  return (
    <div
      css={css`
        padding: 3em;
      `}
    >
      <h1>Doc Store</h1>
      <Editor key={_id} document={currentDoc} onChange={setCurrentDoc} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DocStore);
