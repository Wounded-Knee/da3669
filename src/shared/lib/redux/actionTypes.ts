export const shared = Object.freeze({
  ABSORB_NODES: 'ABSORB_NODES',
});

export const server = Object.freeze({
  ...shared,
  GET_NODES_BY_ID: 'GET_NODES_BY_ID',
  GET_TOP_LEVEL_NODES: 'GET_TOP_LEVEL_NODES',
  READ_NODE: 'READ_NODE',
  GET_USER: 'GET_USER',
});

export const client = Object.freeze({
  ...shared,
  SET_USERID: 'SET_USERID',
  ERROR: 'ERROR',
  DRAWER: 'DRAWER',
  READY_WEBSOCKET: 'READY_WEBSOCKET',
  NOOP: 'NOOP',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
});
