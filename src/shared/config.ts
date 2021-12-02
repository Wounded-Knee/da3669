import { Schema } from 'mongoose';

// HTTP Server
const HTTP_SERVER_PORT = 3000;

// WS Server
const WS_SERVER_PORT = 8081;
const WS_SERVER_HOST = 'localhost';

// Store
const initialState = {
  entities: [],
};

// Relation Types
const relationTypes = [
  {
    name: 'reply',
    path: 'replies',
  },
  {
    name: 'upstream',
    path: 'upstreams',
  },
];

// Node Types
const nodeTypes = [
  {
    name: 'Node',
    default: true,
    schemaPaths: {},
  },
  {
    name: 'Document',
    schemaPaths: {
      checkbox: Boolean,
      title: { type: String, required: true },
      text: { type: String, required: true },
      [relationTypes[0].path]: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    },
  },
  {
    name: 'User',
    schemaPaths: {
      name: { type: String, required: true },
    },
  },
  {
    name: 'Message',
    schemaPaths: {
      text: { type: String, required: true },
      [relationTypes[1].path]: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    },
  },
];

const appName = 'D³';
const headerText = `merge℠`;

export {
  relationTypes,
  nodeTypes,
  headerText,
  appName,
  initialState,
  HTTP_SERVER_PORT,
  WS_SERVER_HOST,
  WS_SERVER_PORT,
};
