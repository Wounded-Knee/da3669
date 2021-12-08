import { store } from '../../lib/redux/store';
import { WS_SERVER_HOST, WS_SERVER_PORT } from '../../config';
import { WebsocketBuilder, LRUBuffer } from 'websocket-ts';
const WS_URL = `ws://${WS_SERVER_HOST}:${WS_SERVER_PORT}`;

const debug = {
  send: true,
  action: true,
};

export const ws = new WebsocketBuilder(WS_URL)
  .withBuffer(new LRUBuffer(1000))
  .onMessage((instance, { data }) => {
    const action = JSON.parse(data);
    if (debug.action) console.log('ACTION ', action);
    store.dispatch(action);
  })
  .build();

// ws.addEventListener('message', ({ data }) => {
//   const action = JSON.parse(data);
//   store.dispatch(action);
// });

export const send = (data) => {
  if (debug.send) console.info('WS SEND ', data);
  ws.send(data);
};
export const sendJSON = (data) => send(JSON.stringify(data));
export const dispatch = (action) => sendJSON(action);
export const action = (type, payload) => dispatch({ type, payload });

// @ts-ignore
window.wsClient = ws;
