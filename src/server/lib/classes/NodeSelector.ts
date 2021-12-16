import mongoose from 'mongoose';
import { NodeSelector as NodeSelectorParent } from '../../../shared/lib/NodeSelector';
import { defaultNodeType, INodeAll } from '../../../shared/nodes/all';
import { INodeBase } from '../../../../dist/shared/nodes/Base';
import { NodeId } from '../../../shared/all';
const { model: DefaultModel } = defaultNodeType;

export class NodeSelector extends NodeSelectorParent {
  get mongooseNodeIds(): NodeId[] {
    const { ObjectId } = mongoose.Types;
    return this.ids.reduce((baseNodeIds, id) => {
      try {
        return [...baseNodeIds, new ObjectId(id)];
      } catch (e) {
        return baseNodeIds;
      }
    }, []);
  }

  async getNodes(): Promise<INodeBase[]> {
    const baseNodes = this.self ? await DefaultModel.find({ _id: { $in: this.mongooseNodeIds } }) : [];
    const query = {
      $or: this.relationTypes.reduce((queries, RelationType) => {
        return [...queries, { [`rel.${RelationType.literal.plural}`]: { $in: this.ids } }];
      }, []),
    };
    const relations = this.relationTypes.length ? await DefaultModel.find(query) : [];
    return [...baseNodes, ...relations];
  }

  // In: Candidates for Broadcast: List of nodes which have been created or updated
  // State: A NodeSelector data set
  // Out: A subset of the original node list denoting which ones fit that selector
  filterMatchingNodes(nodeArray: INodeAll[]): INodeAll[] {
    console.log('\n'.repeat(10) + 'filterMatchingNodes()');
    return nodeArray.filter((node) => {
      const self = this.self && this.ids.indexOf(node._id) !== -1;
      console.log(`${node._id} in `, this.ids, node.rel);
      const relations = this.relationTypes.reduce((includeNodeBool, RelationType) => {
        // @ts-ignore
        return includeNodeBool || (RelationType.isVirtual && node.rel[RelationType.literal.plural].contains(node._id));
      }, false);
      console.log(`${node._id}: ${node.text} ${self && 'Matched as self'} ${self && 'Matched as relation'}`);
      return self || relations;
    });
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectNodes = (...args: any): NodeSelector => new NodeSelector(...args);
