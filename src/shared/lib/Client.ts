import { WS_SERVER_HOST, WS_SERVER_PORT } from '../config';
import { Client as RPCClient } from 'rpc-websockets';
// @ts-ignore
import { actions } from '../../client/ReduxStore';
import Kernel from './classes/Kernel';
// @ts-ignore
const { receiveEntity } = actions;

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
          this.rpcClient.subscribe('newEntity');
          this.rpcClient.on('newEntity', this.newEntity.bind(this));
          resolve(void 0);
        });
      }),
    );
  }

  newEntity(...args) {
    console.log('Client shall integrate new entity... ', args);
    receiveEntity(...args);
  }

  call(method, ...args) {
    this.log('call', method, args);
    return this.initialize()
      .then(() => this.rpcClient.call(method, args))
      .catch((err) => console.log(err));
  }
}
Object.assign(Client.prototype, {
  _className: 'Client',
});

export default Client;
