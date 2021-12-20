import { INodeTypeDefinition, NodeId } from '../../../shared/all';

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
    [
      ['author', 'authors'],
      ['work', 'works'],
    ],
  ],
  options: { discriminatorKey: 'kind', timestamps: true },
  schemaPaths: {},
};
