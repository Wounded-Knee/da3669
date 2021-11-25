import { model, Schema } from 'mongoose';

const documentSchema = new Schema(
  {
    text: String,
    title: String,
  },
  {
    timestamps: true,
  },
);

// Statics
documentSchema.static({
  list: function () {
    return this.find({}, '_id title');
  },
  persist: function (document) {
    const { _id } = document;
    console.log('persist by id ', _id);
    switch (_id) {
      case undefined:
        console.log('New doc ', document, this);
        return this.create([document]);
      default:
        console.log('howdy!');
        return Document.findByIdAndUpdate(_id, document, { new: true });
    }
  },
});

export const createDocument = (document) => new Document(document).save();
export const persistDocument = async (document) => {
  const { _id, __v, createdAt, updatedAt, ...cleanDocument } = document;
  if (_id) {
    console.log('Updating ', _id, cleanDocument);
    return await Document.findOneAndUpdate({ _id }, cleanDocument, { upsert: true });
  } else {
    console.log('Creating ', cleanDocument);
    return await new Document(cleanDocument).save();
  }
};

export const namespace = 'document';
export const actions = {
  create: createDocument,
  persist: persistDocument,
};
const Document = model('Document', documentSchema);

export default Document;
