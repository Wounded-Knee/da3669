import { actionTypes } from '../../lib/redux/reducer';
import { call } from '../../lib/transport';

const document = {
  persist: (node) => call('document.persist', node),
  list: async () => await call('document.list'),
  getNodeById: async (nodeId) => await call('document.getNodeById', nodeId),
};

export const persist = (node) => generic(document.persist, actionTypes.NODE_REPLACE, node);
export const nodeList = () => generic(document.list, actionTypes.NODE_REPLACE);
export const getNodeById = (nodeId) => generic(document.getNodeById, actionTypes.NODE_REPLACE, nodeId);

export const generic = (remoteAction, localAction, ...args) => {
  return async function generic(dispatch) {
    const payload = await remoteAction(...args);
    dispatch({ type: localAction, payload });
  };
};
