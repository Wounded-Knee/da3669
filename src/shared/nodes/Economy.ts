import mongoose from 'mongoose';
export default {
  name: 'Economy',
  extending: 'Base',
  schemaPaths: {
    qty: Number,
    destinationId: mongoose.Types.ObjectId,
  },
};
