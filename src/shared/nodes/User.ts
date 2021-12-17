import { INodeTypeDefinition } from '../all';

export default <INodeTypeDefinition>{
  name: 'User',
  extending: 'Base',
  relationTypes: [
    [
      ['author', 'authors'],
      ['work', 'works'],
    ],
  ],
  schemaPaths: {
    name: { type: String, required: true },
    googleId: String,
    pictureUrl: String,
  },
};
