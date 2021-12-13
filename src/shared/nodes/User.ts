import mongoose from 'mongoose';
export default {
  name: 'User',
  extending: 'Base',
  schemaPaths: {
    name: { type: String, required: true },
    googleId: String,
    pictureUrl: String,
  },
};
