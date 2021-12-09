import { store } from '../../lib/redux/store';

export const getNodeById = (id) => ({
  ...store.getState().nodes.find(({ _id }) => _id === id),
  downstreams: store.getState().nodes.filter(({ upstreams }) => upstreams.indexOf(id) !== -1),
});
export const getTopLevelNodes = () => store.getState().nodes.filter(({ upstreams }) => upstreams.length < 1);
export const getNodesById = (nodeIdArray) => {
  return nodeIdArray.map((id) => getNodeById(id));
};
