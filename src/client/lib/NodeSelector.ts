import { NodeSelector as NodeSelectorParent } from '../../shared/lib/NodeSelector';
import { store } from './redux/store';
import { relationTypes } from '../../shared/nodes/all';

export class NodeSelector extends NodeSelectorParent {
  get nodes() {
    const allNodes = store.getState().nodes;
    const theseNodes = allNodes.filter(({ _id }) => this.ids.indexOf(_id) !== -1);
    const theseRelationTypes = relationTypes.filter(([obverse, converse]) => {
      // @ts-ignore
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
}

export const selectNodes = (...args) => new NodeSelector(...args);
