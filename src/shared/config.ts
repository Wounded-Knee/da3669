import { Schema } from 'mongoose';

// HTTP Server
const HTTP_SERVER_PORT = 3000;

// WS Server
const WS_SERVER_PORT = 3000;
const WS_SERVER_HOST = 'localhost';

// Store
const initialState = {
  entities: [],
};

//Types
const relationTypes = ['Reply', 'Stream'];
const nodeTypes = ['Base', 'Document', 'User', 'Message'];

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
