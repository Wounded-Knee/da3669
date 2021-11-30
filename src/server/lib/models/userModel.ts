import NodeModel from './nodeModel';
const { extend } = NodeModel;

export default extend({
  name: 'User',
  schemaPaths: {
    name: { type: String, required: true },
  },
});
