import transport from './transport';
import mongoose from 'mongoose';
import HTTPServer from './lib/classes/HttpServer';
import { relationTypes, HTTP_SERVER_PORT } from './config';
import { getNonVirtualPaths, getNonVirtualPathsByName } from '../shared/relations/all';
import { getNodeTypeByName, defaultNodeType } from './lib/nodes/all';

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
    const { model } = getNodeTypeByName(kind);
    console.log(`Persist (as ${model.modelName})`);
    const primaryNode = await model.persist(node);
    relations.forEach((relation) => {});
    console.log('Not relating ', relations);
    return primaryNode;
  } else {
    console.error('Node has no "kind"', node);
    return Promise.reject('No kind');
  }
});

// @ts-ignore
transport.register('relate', async ([type, node1id, node2id]) => {
  let errorText;
  const pathName = getNonVirtualPathsByName(type);
  if (pathName) {
    const parentNode = await DefaultModel.findById(node1id);
    if (pathName in parentNode && !isNaN(parentNode[pathName].length)) {
      parentNode[pathName].push(node2id);
      return await parentNode.save();
    } else {
      errorText = `Node #${node1id} has no ${type} collection path named ${pathName}.`;
    }
  } else {
    errorText = `Can't handle relation type ${type}.`;
  }
  console.error(errorText);
  return Promise.reject(errorText);
});

transport.register('list', async () => {
  return await DefaultModel.find({}, '_id');
});

transport.register('getById', async (_id) => {
  const populatePaths = getNonVirtualPaths();
  console.log('populatePaths:', populatePaths);
  console.log('DefaultModel', DefaultModel);
  const gotById = await DefaultModel.findById(_id).populate(populatePaths);
  console.log('gotById', gotById);
  const { model } = getNodeTypeByName(gotById.kind);
  console.log('model', model);
  const downStreams = await model.find({ upstreams: _id });

  return {
    ...gotById._doc,
    downstreams: downStreams,
  };
});

Promise.all([mongoosePromise, httpServer.initialize()]).then(() => {
  console.log('Ready');
});
