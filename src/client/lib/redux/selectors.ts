import { store } from '../../lib/redux/store';
import { nodeTypes, relationTypes } from '../../../shared/nodes/all';
import { addHelper } from '../debug';

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

function intersect(a, b) {
  const setB = new Set(b);
  return [...new Set(a)].filter((x) => setB.has(x));
}

export class NodeSelector {
  ids = [];
  self = true;
  rel = false;
  pop = false;

  constructor(...ids) {
    this.ids = ids;
  }

  id(id) {
    this.ids.push(id);
    return this;
  }

  notSelf() {
    this.self = false;
    return this;
  }

  andRelations(...relationTypes) {
    if (this.rel !== true) {
      if (relationTypes.length === 0) {
        this.rel = true;
      } else {
        this.rel = relationTypes;
      }
    }
    return this;
  }

  get nodes() {
    const allNodes = store.getState().nodes;
    const theseNodes = allNodes.filter(({ _id }) => this.ids.indexOf(_id) !== -1);
    const theseRelationTypes = relationTypes.filter(([obverse, converse]) => {
      return this.rel === true || (this.rel instanceof Array && intersect(this.rel, converse).length);
    });
    return theseNodes.map((thisNode) => {
      return {
        ...thisNode,
        rel: theseRelationTypes.reduce(
          (rel, [obverse, converse]) => ({
            ...rel,
            [converse[1]]: allNodes
              .filter((node) => node[obverse[1]] && node[obverse[1]].indexOf(thisNode._id) !== -1)
              .map((node) => (this.pop ? node : node._id)),
          }),
          {},
        ),
      };
    });
  }

  populate() {
    this.pop = true;
    return this;
  }

  getServer() {
    return {
      ids: this.ids,
      self: this.self,
      rel: this.rel,
    };
  }
}

addHelper({
  selectNode: (...args) => new NodeSelector(...args),
});
