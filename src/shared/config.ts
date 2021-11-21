// HTTP Server
const HTTP_SERVER_PORT = 3000;

// WS Server
const WS_SERVER_PORT = 8081;
const WS_SERVER_HOST = 'localhost';

// Store
const initialState = {
  entities: [],
};

// Entities
const entityModules = ['Entity', 'Image', 'Relationship', 'YouTube'];
const defaultEntityModule = entityModules[0];

export { entityModules, defaultEntityModule, initialState, HTTP_SERVER_PORT, WS_SERVER_HOST, WS_SERVER_PORT };
