/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require('mongoose');
const cfg = require('./dist/server/config');
const { MONGODB_URL } = process.env;
const { Schema } = mongoose;
const NodeModel = require('./dist/server/lib/models/NodeModel').default;
const { extend } = NodeModel;

const { model: Message } = extend({
  name: 'Message',
  schemaPaths: {
    text: { type: String, required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  },
});

mongoose.connect(MONGODB_URL.replace('development', 'test'), () => {
  console.log('Connected.');

  new Message({ text: 'What is the airspeed velocity of an unladen swallow?' }).save().then((parentMessage) => {
    new Message({ text: 'African or European?' }).save().then((replyMessage) => {
      parentMessage.replies.push(replyMessage._id);
      parentMessage.save().then((parentMessage) => {
        parentMessage.populate('replies').then(console.log);
      });
    });
  });
});
