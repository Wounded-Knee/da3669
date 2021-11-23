/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { connect } from 'react-redux';
import { Editor } from './Editor';
import { actionTypes } from '../../lib/redux/reducer';
import tx from '../../lib/redux/tx';

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  update: ({ target: { value } }) => {
    const remoteAction = { type: actionTypes.DOCSTORE_UPDATE, payload: { text: value } };
    console.log('remoteAction ', remoteAction);
    return dispatch(tx(remoteAction)).then((...args) => console.log('Returned ', ...args));
  },
});

export const DocStore = ({ state, update }) => {
  return (
    <div
      css={css`
        padding: 3em;
      `}
    >
      <h1>Doc Store</h1>
      <Editor state={state} onChange={update} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DocStore);
