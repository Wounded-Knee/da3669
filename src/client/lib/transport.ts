import { Client } from 'rpc-websockets';
import { WS_SERVER_HOST, WS_SERVER_PORT } from '../config';

const url = `ws://${WS_SERVER_HOST}:${WS_SERVER_PORT}`;
const transport = new Client(url);

export const call = (methodName, ...args) => {
  return transport
    .call(methodName, args)
    .then((rv) => {
      console.log(' Server Call: ', methodName, ...args, '\n', 'Server Response: ', rv, '\n');
      return rv;
    })
    .catch((...err) => {
      console.error(' Server Call: ', methodName, ...args, '\n', 'Server Error: ', ...err, '\n');
    });
};

export default transport;
