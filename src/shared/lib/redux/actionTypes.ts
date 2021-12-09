export const shared = Object.freeze({
  ABSORB_NODE: 'ABSORB_NODE',
});

export const server = Object.freeze({
  ...shared,
  GET_NODE_BY_ID: 'GET_NODE_BY_ID',
});

export const client = Object.freeze({
  ...shared,
  ERROR: 'ERROR',
});
