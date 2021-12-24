import { NodeSelector as SuperNodeSelector } from '../../shared/lib/NodeSelector';
import { RelationType } from '../../shared/lib/RelationType';
import { store } from './redux/store';
import { NodeId, INodeAll } from '../../shared/all';

export class NodeSelector extends SuperNodeSelector {
  async getMyNodes(): Promise<INodeAll[]> {
    return Promise.resolve(store.getState().nodes);
  }

  get nodes(): INodeAll[] {
    const { me, myRelations } = this.cfg;
    const allNodes = store.getState().nodes;
    const myNodeIds = me.map((_id) => _id.toString());
    const myNodes = allNodes.filter(({ _id }) => myNodeIds.length === 0 || myNodeIds.indexOf(_id.toString()) !== -1);

    return this.requiresRelations()
      ? allNodes.filter((node) => {
          const rv = Object.keys(myRelations).reduce((useThis: boolean, rel: string) => {
            if (myRelations[rel] === null) return useThis;

            // Combines all base node relations of [rel] type into one array
            const combinedBaseNodeRelations = myNodes.reduce((relations, myNode) => {
              return [
                ...relations,
                ...((myNode.rel && myNode.rel[new RelationType(rel).literal.plural]) || []).map((objectId) =>
                  objectId.toString(),
                ),
              ];
            }, []);
            const candidateNodeRelations = ((node.rel && node.rel[new RelationType(rel).literal.plural]) || []).map(
              (objectId) => objectId.toString(),
            );

            console.log(`My Real Relations (${rel})`, combinedBaseNodeRelations);
            console.log(
              `Candidate Relations (${new RelationType(rel).literal.plural})`,
              node.rel[new RelationType(rel).literal.plural] || [],
            );
            console.log('Base Node IDs ', me);
            console.log(
              'Candidate Relations / Base ID Intersection ',
              me.filter((myNodeId) => (node.rel[new RelationType(rel).literal.plural] || []).includes(myNodeId)),
            );

            return useThis || new RelationType(rel).isLiteral
              ? combinedBaseNodeRelations.includes(node._id)
              : !!me.filter((myNodeId) => candidateNodeRelations.includes(myNodeId.toString())).length;
          }, false);
          console.log('Node Included: ', rv, node, myRelations);
          return rv;
        })
      : myNodes;
  }
}

export const selectNodes = (...nodeIds: NodeId[]): NodeSelector => new NodeSelector(...nodeIds);
