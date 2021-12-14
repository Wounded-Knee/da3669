import mongoose from 'mongoose';
import { NodeSelector as NodeSelectorParent } from '../../../shared/lib/NodeSelector';
import { defaultNodeType } from '../../../shared/nodes/all';
const { model: DefaultModel } = defaultNodeType;

export class NodeSelector extends NodeSelectorParent {
  async getNodes() {
    const { ObjectId } = mongoose.Types;
    const baseNodeIds = this.ids.reduce((baseNodeIds, id) => {
      try {
        return [...baseNodeIds, new ObjectId(id)];
      } catch (e) {
        return baseNodeIds;
      }
    }, []);
    const baseNodes = this.self ? await DefaultModel.find({ _id: { $in: baseNodeIds } }) : [];
    const query = {
      $or: this.relationTypes.reduce((queries, [obverse, converse]) => {
        return [...queries, { [`rel.${obverse[1]}`]: { $in: this.ids } }];
      }, []),
    };
    const relations = this.relationTypes.length ? await DefaultModel.find(query) : [];
    return [...baseNodes, ...relations];
  }
}

export const selectNodes = (...args) => new NodeSelector(...args);
