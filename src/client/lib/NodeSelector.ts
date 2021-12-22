import { NodeSelector as SuperNodeSelector } from '../../shared/lib/NodeSelector';
import { RelationType } from '../../shared/lib/RelationType';
import { store } from './redux/store';
import { NodeId, INodeAll } from '../../shared/all';

export class NodeSelector extends SuperNodeSelector {
  get nodes(): INodeAll[] {
    const { me, myRelations } = this.cfg;
    const allNodes = store.getState().nodes;
    const myNodes = allNodes.filter(({ _id }) => me.length === 0 || me.indexOf(_id) !== -1);

    return [
      ...myNodes,
      ...allNodes.filter((node) => {
        return Object.keys(myRelations).reduce((useThis: boolean, rel: string) => {
          if (myRelations[rel] === null) return useThis;

          const myRealRelations = myNodes.reduce((relations, myNode) => {
            return [...relations, ...((myNode.rel && myNode.rel[new RelationType(rel).literal.plural]) || [])];
          }, []);

          return useThis || new RelationType(rel).isLiteral
            ? myRealRelations.includes(node._id)
            : !!me.filter((value) => (node.rel[new RelationType(rel).literal.plural] || []).includes(value)).length;
        }, false);
      }),
    ];
  }
}

export const selectNodes = (...nodeIds: NodeId[]): NodeSelector => new NodeSelector(...nodeIds);
