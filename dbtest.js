const mongoose = require('mongoose');
const cfg = require('./dist/server/config');
const { MONGODB_URL } = process.env;
const { Schema } = mongoose;

mongoose.connect(MONGODB_URL.replace('development', 'test'), () => {
  console.log('Connected.');

  const options = { discriminatorKey: 'kind', timestamps: true };

  const Node = mongoose.model(
    'Node',
    new mongoose.Schema(
      {
        time: {
          type: Date,
          default: Date.now,
        },
      },
      options,
    ),
  );

  // ClickedLinkEvent
  const Document = Node.discriminator(
    'Document',
    new mongoose.Schema(
      {
        title: { type: String, required: true },
        text: { type: String, required: true },
      },
      options,
    ),
  );

  /*
  var rawNode = new Node({});
  rawNode.save();

  var docNode = new Document({
    title: 'Doc Title',
    text: 'zxcvb',
  });
  docNode.save();
  */

  console.log(Document.prototype);

  //Document.find({}).then(console.log);
});
