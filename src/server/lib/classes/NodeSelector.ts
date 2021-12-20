import mongoose from 'mongoose';
import { NodeSelector as NodeSelectorParent } from '../../../shared/lib/NodeSelector';
import { getModelByName, defaultModel } from '../nodes/all';
import { INodeBase, NodeId } from '../../../shared/all';

export interface INodeAll extends INodeBase {
  text: string;
}

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
    const baseNodes = this.self ? await defaultModel.find({ _id: { $in: this.mongooseNodeIds } }) : [];
    const query = {
      $or: this.relationTypes.reduce((queries, RelationType) => {
        return [...queries, { [`rel.${RelationType.literal.plural}`]: { $in: this.ids } }];
      }, []),
    };
    const relations = this.relationTypes.length ? await defaultModel.find(query) : [];
    return [...baseNodes, ...relations];
  }

  // In: Candidates for Broadcast: List of nodes which have been created or updated
  // State: A NodeSelector data set
  // Out: A subset of the original node list denoting which ones fit that selector
  filterMatchingNodes(nodeArray: INodeAll[]): INodeAll[] {
    return nodeArray.filter(({ rel, _id, text }) => {
      let relations = false;
      const self = this.self && this.ids.indexOf(_id) !== -1;
      if (rel) {
        relations = this.relationTypes.reduce((includeNodeBool, RelationType) => {
          return (
            includeNodeBool ||
            (RelationType.isVirtual &&
              rel &&
              rel[RelationType.literal.plural] instanceof Array &&
              rel[RelationType.literal.plural].filter((value) => this.ids.includes(value)).length)
          );
        }, false);
      }
      return self || relations;
    });
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectNodes = (...args: any): NodeSelector => new NodeSelector(...args);
