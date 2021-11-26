import { Server } from 'rpc-websockets';
import { WS_SERVER_HOST, WS_SERVER_PORT } from './config';

const transport = new Server({
  port: WS_SERVER_PORT,
  host: WS_SERVER_HOST,
});

export default transport;
