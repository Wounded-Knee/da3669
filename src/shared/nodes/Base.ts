import { Schema } from 'mongoose';
import { relationTypes } from '../relations/all';

export default {
  name: 'Node',
  default: true,
  options: { discriminatorKey: 'kind', timestamps: true },
  schemaPaths: {
    ...relationTypes.reduce(
      (relationPaths, { relations }) => ({
        ...relationPaths,
        ...relations
          .filter(({ virtual }) => !virtual)
          .reduce(
            (relationPaths, { path }) => ({
              [path]: [{ type: Schema.Types.ObjectId, ref: 'Node' }],
            }),
            {},
          ),
      }),
      {},
    ),
  },
};
