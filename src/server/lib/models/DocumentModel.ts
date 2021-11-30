import NodeModel from './NodeModel';
const { extend } = NodeModel;

export default extend({
  name: 'Document',
  schemaPaths: {
    checkbox: Boolean,
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
});
