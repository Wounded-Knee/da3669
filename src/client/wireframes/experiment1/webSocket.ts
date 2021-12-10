import { store } from '../../lib/redux/store';
import { WS_SERVER_HOST, WS_SERVER_PORT } from '../../config';
import { WebsocketBuilder, LRUBuffer } from 'websocket-ts';
import { v4 as uuidv4 } from 'uuid';
const WS_URL = `ws://${WS_SERVER_HOST}:${WS_SERVER_PORT}`;

const debug = {
  send: true,
  action: true,
  errors: true,
};

const promises = [];

export const ws = new WebsocketBuilder(WS_URL)
  .withBuffer(new LRUBuffer(1000))
  .onMessage((instance, { data }) => {
    const packet = JSON.parse(data);
    const { action, promiseId: packetPromiseId } = packet;
    if (action) {
      if (debug.action) console.log('ACTION ', action);
      const promiseObj = promises.find(({ promiseId }) => promiseId === packetPromiseId);

      if (action.type === 'ERROR') {
        if (debug.errors) console.error(action);
        if (promiseObj) promiseObj.reject(action);
      } else {
        if (promiseObj) promiseObj.resolve(action);
        store.dispatch(action);
      }
    } else {
      console.error('Non-Action Message Received: ', packet);
    }
  })
  .build();

export const send = (data) => {
  if (debug.send) console.info('WS SEND ', data);
  ws.send(data);
};

export const sendJSON = (data) => send(JSON.stringify(data));

export const dispatch = (action) =>
  new Promise((resolve, reject) => {
    const promiseId = uuidv4();

    promises.push({
      promiseId,
      action,
      resolve,
      reject,
    });

    sendJSON({
      action,
      promiseId,
    });
  });

export const action = (type, payload) => dispatch({ type, payload });

// @ts-ignore
window.d3 = {
  ...(window.d3 || {}),
  ws: {
    send,
    sendJSON,
    dispatch,
    action,
    getPromises: () => promises,
  },
};
