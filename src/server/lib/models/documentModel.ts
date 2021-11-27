import { model, Schema } from 'mongoose';

const modelName = 'Document';
const namespace = modelName.toLowerCase();

const schema = new Schema(
  {
    text: String,
    title: String,
  },
  {
    timestamps: true,
  },
);

const Model = model(modelName, schema);

export default {
  namespace,
  schema,
  model: Model,
  actions: {
    getNodeById: async (nodeId) => {
      return await Model.findOne({ _id: nodeId });
    },
    list: async () => {
      return await Model.find({});
    },
    persist: async (document) => {
      const { _id, __v, createdAt, updatedAt, ...cleanDocument } = document;
      if (_id) {
        return await new Promise((resolve, reject) => {
          console.log('persisting ', cleanDocument);
          Model.findOneAndUpdate({ _id }, cleanDocument, { upsert: true }, (nothing, document) => {
            console.log(document);
            resolve(document);
          });
        });
      } else {
        console.log('New document ', _id, cleanDocument, document);
        return await new Model(cleanDocument).save();
      }
    },
  },
};
