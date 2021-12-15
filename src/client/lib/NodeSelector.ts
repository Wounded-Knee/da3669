import { NodeSelector as NodeSelectorParent } from '../../shared/lib/NodeSelector';
import { store } from './redux/store';
import { server } from '../../shared/lib/redux/actionTypes';

export class NodeSelector extends NodeSelectorParent {
  get nodes() {
    const allNodes = store.getState().nodes;
    const baseNodes = allNodes.filter(({ _id }) => this.ids.indexOf(_id) !== -1);
    return baseNodes.map((thisNode) => {
      return {
        ...thisNode,
        rel: {
          ...thisNode.rel,
          ...this.relationTypes.reduce(
            (rel, RelationType) => ({
              ...rel,
              [RelationType.virtual.plural]: allNodes
                .filter(
                  ({ rel }) =>
                    rel &&
                    rel[RelationType.literal.plural] &&
                    rel[RelationType.literal.plural].indexOf(thisNode._id) !== -1,
                )
                .map((node) => (this.pop ? node : node._id)),
            }),
            {},
          ),
        },
      };
    });
  }

  get serverAction() {
    return {
      type: server.SUBSCRIBE2,
      payload: {
        ids: this.ids,
        self: this.self,
        pop: this.pop,
        rel: this.rel,
      },
    };
  }
}

export const selectNodes = (...args) => new NodeSelector(...args);
