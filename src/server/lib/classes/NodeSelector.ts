import { NodeSelector as NodeSelectorParent } from '../../../shared/lib/NodeSelector';
import { relationTypes } from '../../../shared/nodes/all';
import { broadcastCreatedNodes } from './NodeSubscriptions';
import { getNodeTypeByName, defaultNodeType } from '../../../shared/nodes/all';
import { Types } from 'mongoose';
const { model: DefaultModel } = defaultNodeType;

export class NodeSelector extends NodeSelectorParent {
  async getNodes() {
    const { ObjectId } = Types;
    const baseNodeIds = this.ids.reduce((baseNodeIds, id) => {
      try {
        return [...baseNodeIds, new ObjectId(id)];
      } catch (e) {
        return baseNodeIds;
      }
    }, []);
    console.log('baseNodeIds', baseNodeIds, this.ids);
    const baseNodes = this.self && (await DefaultModel.find({ _id: { $in: baseNodeIds } }));
    return baseNodes
      ? baseNodes.map(({ _doc: thisNode }) => {
          return {
            ...thisNode,
            rel: this.relationTypes.reduce(async (rel, [obverse, converse]) => {
              const query = {
                rel: {
                  [obverse[1]]: { $in: [thisNode._id] },
                },
              };
              console.log('Query ', query);
              return {
                ...rel,
                [converse[1]]: (await DefaultModel.find(query)).map((node) => (this.pop ? node : node._id)),
              };
            }, {}),
          };
        })
      : [];
  }
}

export const selectNodes = (...args) => new NodeSelector(...args);
