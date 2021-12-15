import mongoose from 'mongoose';
import { NodeSelector as NodeSelectorParent } from '../../../shared/lib/NodeSelector';
import { defaultNodeType } from '../../../shared/nodes/all';
const { model: DefaultModel } = defaultNodeType;

export class NodeSelector extends NodeSelectorParent {
  get mongooseNodeIds() {
    const { ObjectId } = mongoose.Types;
    return this.ids.reduce((baseNodeIds, id) => {
      try {
        return [...baseNodeIds, new ObjectId(id)];
      } catch (e) {
        return baseNodeIds;
      }
    }, []);
  }

  async getNodes() {
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
  filterMatchingNodes(nodeArray) {
    return nodeArray.filter((node) => {
      if (this.self && this.ids.indexOf(node._id) !== -1) return true;
      return this.relationTypes.reduce((includeNodeBool, RelationType) => {
        return includeNodeBool || (RelationType.isVirtual && node.rel[RelationType.literal.plural].contains(node._id));
      }, false);
    });
  }
}

export const selectNodes = (...args) => new NodeSelector(...args);
