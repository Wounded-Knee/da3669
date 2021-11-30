// HTTP Server
const HTTP_SERVER_PORT = 3000;

// WS Server
const WS_SERVER_PORT = 8081;
const WS_SERVER_HOST = 'localhost';

// Store
const initialState = {
  entities: [],
};

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
    },
  },
  {
    name: 'User',
    schemaPaths: {
      name: { type: String, required: true },
    },
  },
];

// Entities
const entityModules = ['Entity', 'Image', 'Relationship', 'YouTube', 'User', 'Message'];
const defaultEntityModule = entityModules[0];

const appName = 'D³';

export {
  nodeTypes,
  appName,
  entityModules,
  defaultEntityModule,
  initialState,
  HTTP_SERVER_PORT,
  WS_SERVER_HOST,
  WS_SERVER_PORT,
};
