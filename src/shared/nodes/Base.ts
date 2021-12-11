import mongoose, { Schema } from 'mongoose';
import { relationTypes } from '../relations/all';

const modelName = 'Base';
export default {
  name: modelName,
  default: true,
  options: { discriminatorKey: 'kind', timestamps: true },
  schemaPaths: {
    reads: [
      {
        user: mongoose.Types.ObjectId,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    ...relationTypes.reduce(
      (relationPaths, { relations }) => ({
        ...relationPaths,
        ...relations
          .filter(({ virtual }) => !virtual)
          .reduce(
            (relationPaths, { path }) => ({
              [path]: [{ type: Schema.Types.ObjectId, ref: modelName }],
            }),
            {},
          ),
      }),
      {},
    ),
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
