/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { connect } from 'react-redux';
import { Editor } from './Editor';
import { actionTypes } from '../../lib/redux/reducer';
import tx from '../../lib/redux/tx';

const mapStateToProps = (state: { documents: any[] }, { documentId }: any) => ({
  document: (() => {
    console.log(`Selecting ${documentId} from `, state.documents);
    return state.documents.find(({ _id }) => _id === documentId);
  })(),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  // getDocById: (docId: any) => {
  //   return new Promise((resolve, reject) => {
  //     const remoteAction = { type: actionTypes.DOCSTORE_GET_DOC_BY_ID, payload: docId };
  //     dispatch(tx(remoteAction)).then((document) => {
  //       console.log(`getDocById(${JSON.stringify(remoteAction)})`, document);
  //     });
  //   });
  // },
  persistDocument: (editorState: any) => {
    const remoteAction = { type: actionTypes.DOCSTORE_UPDATE, payload: editorState };
    return new Promise((resolve, reject) => {
      dispatch(tx(remoteAction)).then(({ payload }) => resolve(payload));
    });
  },
});

export const DocStore = ({ persistDocument }) => {
  const [document, setDocument] = useState(undefined);
  console.log('DocStore Document ', document);
  // useEffect(() => {
  //   // Runs ONCE after initial rendering
  //   // and after every rendering ONLY IF `docId` changes
  //   const { _id } = document;
  //   if (_id) getDocById(_id);
  // }, [docId]);

  return (
    <div
      css={css`
        padding: 3em;
      `}
    >
      <h1>Doc Store</h1>
      <Editor
        key={document}
        document={document}
        onChange={(document) => {
          persistDocument(document).then((document) => {
            console.log('Server-supplied document ', document);
            setDocument(document);
          });
        }}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DocStore);
