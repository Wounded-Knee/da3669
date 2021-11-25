const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const documentSchema = new Schema(
  {
    text: String,
    title: String,
  },
  {
    timestamps: true,
  },
);

const Document = mongoose.model('Document', documentSchema);

export default Document;
