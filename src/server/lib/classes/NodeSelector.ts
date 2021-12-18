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
    const baseNodes = this.self ? await this.getBaseNodes() : [];
    const query = {
      $or: this.relationTypes.reduce((queries, RelationType) => {
        return [...queries, { [`rel.${RelationType.literal.plural}`]: { $in: this.ids } }];
      }, []),
    };
    const relations = this.relationTypes.length ? await DefaultModel.find(query) : [];
    return [...baseNodes, ...relations];
  }

  async getBaseNodes(): Promise<INodeBase[]> {
    return await DefaultModel.find({ _id: { $in: this.mongooseNodeIds } });
  }

  // In: Candidates for Broadcast: List of nodes which have been created or updated
  // State: A NodeSelector data set
  // Out: A subset of the original node list denoting which ones fit that selector
  async filterMatchingNodes(candidateNodes: INodeAll[]): INodeAll[] {
    const baseNodes = await this.getBaseNodes();
    return candidateNodes.filter((candidateNode) => {
      this.relationTypes.reduce((candidateVerified, RelationType) => {
        if (RelationType.isVirtual) {
          return candidateVerified;
        } else if (RelationType.isLiteral) {
        }
      });
    });
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const selectNodes = (...args: any): NodeSelector => new NodeSelector(...args);
