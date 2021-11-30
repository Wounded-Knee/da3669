import { model, Schema } from 'mongoose';

const modelName = 'Node';
const namespace = modelName.toLowerCase();
const options = { discriminatorKey: 'kind', timestamps: true };
const schema = new Schema({}, options);
schema.statics.persist = async function (node) {
  const { _id, __v, createdAt, updatedAt, ...cleanNode } = node;
  if (_id) {
    return await new Promise((resolve, reject) => {
      this.findOneAndUpdate({ _id }, cleanNode, { upsert: true, returnDocument: 'after' }, (nothing, node) =>
        resolve(node),
      );
    });
  } else {
    //console.log(`New ${modelName} `, _id, cleanNode, node);
    return await new this(cleanNode).save();
  }
};
const Node = model(modelName, schema);

export default {
  modelName,
  namespace,
  model: Node,
  options,
  extend: ({ name, schemaPaths = {}, schemaOptions = {} }) => {
    const namespace = name.toLowerCase();
    const extendedOptions = {
      ...options,
      ...schemaOptions,
    };
    const schema = new Schema(schemaPaths, extendedOptions);
    const model = Node.discriminator(name, schema);

    return {
      modelName: name,
      namespace,
      model,
      options: extendedOptions,
    };
  },
};
