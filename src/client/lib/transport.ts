import { Client } from 'rpc-websockets';
import { WS_SERVER_HOST, WS_SERVER_PORT } from '../config';

const url = `ws://${WS_SERVER_HOST}:${WS_SERVER_PORT}`;
const transport = new Client(url);

export default transport;
