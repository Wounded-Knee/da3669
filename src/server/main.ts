import transport from './transport';
import mongoose from 'mongoose';
import HTTPServer from './lib/classes/HttpServer';
import { relationTypes, HTTP_SERVER_PORT } from './config';
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
  const pathName = relationTypes.find(({ name }) => name === type).path;
  if (pathName) {
    const parentNode = await DefaultModel.findById(node1id);
    if (pathName in parentNode && !isNaN(parentNode[pathName].length)) {
      parentNode[pathName].push(node2id);
      return await parentNode.save();
    } else {
      return Promise.reject(`Node #${node1id} has no ${type} collection path.`);
    }
  } else {
    return Promise.reject(`Can't handle relation type ${type}.`);
  }
});

transport.register('list', async () => {
  return await DefaultModel.find({}, '_id');
});

transport.register('getById', async (_id) => {
  const populatePaths = relationTypes.map(({ path }) => path).join(' ');
  return await DefaultModel.findById(_id).populate(populatePaths);
});

Promise.all([mongoosePromise, httpServer.initialize()]).then(() => {
  console.log('Ready');
});
