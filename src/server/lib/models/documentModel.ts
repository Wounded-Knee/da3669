import { Schema, model } from 'mongoose';
import nodeModel from './nodeModel';
const { options, model: Node } = nodeModel;

const modelName = 'Document';
const namespace = modelName.toLowerCase();
const schema = new Schema(
  {
    checkbox: Boolean,
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  options,
);
const Document = Node.discriminator(modelName, schema);

export default {
  modelName,
  namespace,
  model: Document,
  options,
};
