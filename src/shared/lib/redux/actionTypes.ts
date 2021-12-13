export const shared = Object.freeze({
  ABSORB_NODES: 'ABSORB_NODES',
});

export const server = Object.freeze({
  ...shared,
  SUBSCRIBE: 'SUBSCRIBE',
  SUBSCRIBE_BY_SELECTOR: 'SUBSCRIBE_BY_SELECTOR',
  GET_USER: 'GET_USER',
  ECONOMY_TRANSFER: 'ECONOMY_TRANSFER',
});

export const client = Object.freeze({
  ...shared,
  ERROR: 'ERROR',
  DRAWER: 'DRAWER',
  NOOP: 'NOOP',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UPDATE_NET_WORTH: 'UPDATE_NET_WORTH',
});
