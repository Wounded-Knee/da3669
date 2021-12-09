export const shared = Object.freeze({
  ABSORB_NODE: 'ABSORB_NODE',
});

export const server = Object.freeze({
  ...shared,
  GET_NODE_BY_ID: 'GET_NODE_BY_ID',
  GET_TOP_LEVEL_NODES: 'GET_TOP_LEVEL_NODES',
});

export const client = Object.freeze({
  ...shared,
  SET_USERID: 'SET_USERID',
  ERROR: 'ERROR',
  DRAWER: 'DRAWER',
  READY_WEBSOCKET: 'READY_WEBSOCKET',
});
