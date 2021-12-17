import mongoose, { Schema } from 'mongoose';
import { INodeTypeDefinition, NodeId } from '../all';

export interface INodeBase {
  _id: string;
  author: string;
  rel: {
    [key: string]: NodeId[];
  };
}

const modelName = 'Base';
export default <INodeTypeDefinition>{
  name: modelName,
  default: true,
  relationTypes: [
    [
      ['upstream', 'upstreams'],
      ['downstream', 'downstreams'],
    ],
    [
      ['child', 'children'],
      ['parent', 'parents'],
    ],
  ],
  options: { discriminatorKey: 'kind', timestamps: true },
  schemaPaths: {
    author: Schema.Types.ObjectId,
  },
};
