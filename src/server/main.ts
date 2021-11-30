import transport from './transport';
import mongoose from 'mongoose';
import HTTPServer from './lib/classes/HttpServer';
import { HTTP_SERVER_PORT } from './config';
import { defaultNodeType, getNodeTypeByNodeData } from './lib/nodeTypes';

const { model: DefaultModel } = defaultNodeType;

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
transport.register('persist', async ([node]) => {
  const { kind } = node;
  if (kind) {
    // @ts-ignore
    const { model } = getNodeTypeByNodeData(node);
    console.log(`Persist (as ${model.modelName})`);
    return await model.persist(node);
  } else {
    console.error('Node has no "kind"', node);
    return Promise.reject('No kind');
  }
});

transport.register('list', async () => {
  return await DefaultModel.find({});
});

transport.register('getById', async (_id) => {
  return await DefaultModel.findById(_id);
});

Promise.all([mongoosePromise, httpServer.initialize()]).then(() => {
  console.log('Ready');
});
