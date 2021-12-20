import mongoose, { Schema } from 'mongoose';
export default {
  name: 'Economy',
  extending: 'Base',
  schemaPaths: {
    qty: Number,
    destinationId: Schema.Types.ObjectId,
  },
};
