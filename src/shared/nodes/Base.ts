import mongoose, { Schema } from 'mongoose';

const modelName = 'Base';

export default {
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
    author: mongoose.Types.ObjectId,
    reads: [
      {
        user: mongoose.Types.ObjectId,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  schemaStatics: {
    persist: async function (node, relations = []) {
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
    },
  },
};
