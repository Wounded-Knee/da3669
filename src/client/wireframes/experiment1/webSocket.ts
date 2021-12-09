import { store } from '../../lib/redux/store';
import { WS_SERVER_HOST, WS_SERVER_PORT } from '../../config';
import { WebsocketBuilder, LRUBuffer } from 'websocket-ts';
const WS_URL = `ws://${WS_SERVER_HOST}:${WS_SERVER_PORT}`;

const debug = {
  send: true,
  action: true,
  errors: true,
};

export const ws = new WebsocketBuilder(WS_URL)
  .withBuffer(new LRUBuffer(1000))
  .onMessage((instance, { data }) => {
    const action = JSON.parse(data);
    if (debug.action) console.log('ACTION ', action);
    if (action.type === 'ERROR') {
      if (debug.errors) console.error(action);
    } else {
      store.dispatch(action);
    }
  })
  .build();

export const send = (data) => {
  if (debug.send) console.info('WS SEND ', data);
  ws.send(data);
};
export const sendJSON = (data) => send(JSON.stringify(data));
export const dispatch = (action) => sendJSON(action);
export const action = (type, payload) => dispatch({ type, payload });

// @ts-ignore
window.d3 = {
  ...(window.d3 || {}),
  ws: {
    send,
    sendJSON,
    dispatch,
    action,
  },
};
