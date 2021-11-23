import React from 'react';
import { connect } from 'react-redux';
import { Editor } from './Editor';

const mapStateToProps = (state) => ({
  state,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  update: (state) => dispatch({ type: 'UPDATE', payload: state }),
});

export const DocStore = ({ state, update }) => {
  return (
    <>
      <h1>Doc Store</h1>
      <Editor state={state} onChange={update} />
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DocStore);
