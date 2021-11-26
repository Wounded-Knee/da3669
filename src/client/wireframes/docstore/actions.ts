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
