import { actionTypes } from '../../lib/redux/reducer';
import server from '../../lib/server';

export const setCurrentDoc = (currentDoc) => {
  return async function setCurrentDocThunk(dispatch, getState) {
    const doc = await server.document.persist(currentDoc);
    console.log('scd', doc, currentDoc);
    dispatch({ type: actionTypes.DOCSTORE_SET_CURRENT_DOC, payload: doc });
  };
};
export const getCurrentDoc = (state) => state.ui.docStore.currentDoc;

export const nodeReplace = (nodes) => {
  return (dispatch) => {
    return dispatch({ type: actionTypes.NODE_REPLACE, payload: nodes });
  };
};

export const nodeList = () => {
  return async function thunk(dispatch) {
    const nodes = await server.document.list();
    console.log('Found ' + nodes.length + ' nodes');
    dispatch({ type: actionTypes.NODE_REPLACE, payload: nodes });
  };
};
