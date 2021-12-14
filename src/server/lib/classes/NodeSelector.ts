import { NodeSelector as NodeSelectorParent } from '../../../shared/lib/NodeSelector';
import { relationTypes } from '../../../shared/nodes/all';
import { broadcastCreatedNodes } from './NodeSubscriptions';
import { getNodeTypeByName, defaultNodeType, nodeTypesMore } from '../../../shared/nodes/all';
import mongoose from 'mongoose';
const { model: DefaultModel } = defaultNodeType;
const { model: MessageModel } = getNodeTypeByName('Message');

console.log(nodeTypesMore);

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
        return [...queries, { [`rel.${obverse[1]}`]: { $in: baseNodeIds } }];
      }, []),
    };
    //const query = { kind: 'Message' };
    // const query = this.relationTypes.reduce((queries, [obverse, converse]) => {
    //   const nid = baseNodeIds[0].toString();
    //   console.log('nid', nid);
    //   return [...queries, { [`rel.${obverse[1]}`]: `${nid}` }];
    // }, [])[0];
    console.log('query ', JSON.stringify(query));

    const x = await DefaultModel.find({ kind: 'Message' }).where('rel.upstreams').in(baseNodeIds).exec();
    console.log('xxx', x, baseNodeIds);

    const relations = this.relationTypes.length ? await DefaultModel.find(JSON.parse(JSON.stringify(query))) : [];
    console.log('relations', await DefaultModel.find(JSON.parse(JSON.stringify(query))).explain('allPlansExecution'));
    return [...baseNodes, ...relations];
  }
}

export const selectNodes = (...args) => new NodeSelector(...args);
