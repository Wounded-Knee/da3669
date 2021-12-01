import { Schema } from 'mongoose';
import NodeModel from './NodeModel';
const { extend } = NodeModel;

export default extend({
  name: 'Document',
  schemaPaths: {
    checkbox: Boolean,
    title: { type: String, required: true },
    text: { type: String, required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
  },
});
