import { WS_SERVER_HOST, WS_SERVER_PORT } from '../../../shared/config';
import { Client as RPCClient } from 'rpc-websockets';

const url = `ws://${WS_SERVER_HOST}:${WS_SERVER_PORT}`;
class Client extends RPCClient {
  constructor() {
    super(url);
    this.on('open', () => console.log(`Connected to ${url}`));
  }
}

export default Client;
