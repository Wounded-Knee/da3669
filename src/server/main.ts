import transport from './transport';
import mongoose from 'mongoose';
import HTTPServer from './lib/classes/HttpServer';
import { HTTP_SERVER_PORT } from './config';
import { defaultNodeType, getNodeTypeByNodeData } from './lib/nodeTypes';

const { model: DefaultModel } = defaultNodeType;
const relationTypes = [
  {
    name: 'reply',
    path: 'replies',
  },
];

const mongoDB = {
  url: process.env.MONGODB_URL,
  sslCert: process.env.MONGODB_CERT,
};

const mongoosePromise = mongoose
  .connect(mongoDB.url)
  .then(() => {
    console.log('MongoDB Connected.');
  })
  .catch((err) => {
    if (err.toString().indexOf('certificate validation failed') !== -1) {
      console.error('MongoDB Certificate Validation Failed');
    } else {
      console.error(err);
    }
  });

const httpServer = new HTTPServer({
  port: HTTP_SERVER_PORT,
});

// JSON-RPC 2.0 WebSocket Server methods
// ...this is the API
// @ts-ignore
transport.register('persist', async ([node, relations = []]) => {
  const { kind } = node;
  if (kind) {
    // @ts-ignore
    const { model } = getNodeTypeByNodeData(node);
    console.log(`Persist (as ${model.modelName})`);
    const primaryNode = await model.persist(node);
    relations.forEach((relation) => {});
    return primaryNode;
  } else {
    console.error('Node has no "kind"', node);
    return Promise.reject('No kind');
  }
});

// @ts-ignore
transport.register('relate', async ([type, node1id, node2id]) => {
  switch (type) {
    case 'reply':
      // For now, node1id refers to the parent,
      // node2id refers to the child.
      const parentNode = await DefaultModel.findById(node1id);
      console.log('Found ', parentNode);
      parentNode.replies.push(node2id);
      return await parentNode.save();
    default:
      return Promise.reject(`Can't handle relation type ${type}.`);
  }
});

transport.register('list', async () => {
  return await DefaultModel.find({});
});

transport.register('getById', async (_id) => {
  return await DefaultModel.findById(_id).populate('replies');
});

Promise.all([mongoosePromise, httpServer.initialize()]).then(() => {
  console.log('Ready');
});
