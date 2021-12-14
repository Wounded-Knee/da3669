import { store } from '../../lib/redux/store';
import { addHelper } from '../debug';
import { selectNodes } from '../../lib/NodeSelector';

const augmentNode = (node) =>
  node
    ? {
        ...node,
        downstreams: getDownstreamsById(node._id),
      }
    : node;

export const getNodeById = (id) => augmentNode(store.getState().nodes.find(({ _id }) => _id === id));

export const getTopLevelNodes = () =>
  store.getState().nodes.filter(({ rel: { upstreams = [] } = {} }) => upstreams.length < 1);

export const getNodesById = (nodeIdArray) => {
  return nodeIdArray.map((id) => getNodeById(id));
};

export const getDownstreamsById = (id) =>
  store.getState().nodes.filter(({ rel: { upstreams = [] } = {} }) => upstreams.indexOf(id) !== -1);

export const getDrawerState = (drawerName) => store.getState().ui.drawers[drawerName];

export const getNetWorth = () => store.getState().ui.user.netWorth;

export { selectNodes };

addHelper({
  selectNodes,
});
