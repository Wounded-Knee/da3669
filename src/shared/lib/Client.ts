import Kernel from './Kernel';
import { WS_SERVER_HOST, WS_SERVER_PORT } from '../config';
import { Client as RPCClient } from 'rpc-websockets';

const url = `ws://${WS_SERVER_HOST}:${WS_SERVER_PORT}`;
class Client extends Kernel {
  rpcClient;

  constructor(...args) {
    // @ts-ignore
    super(...args);
    this.whileInitializing(
      new Promise((resolve) => {
        this.rpcClient = new RPCClient(url);
        this.rpcClient.on('open', () => {
          this.log(`Connected to ${url}`);
          resolve(void 0);
        });
      }),
    );
  }

  call(method, ...args) {
    this.log('call', method, args);
    return this.initialize().then(() => this.rpcClient.call(method, args));
  }
}
Object.assign(Client.prototype, {
  _className: 'Client',
});

export default Client;
