import { Client as Wsc } from 'rpc-websockets';
import Client from './Client';

export class WebSocketClient extends Client {
  host;
  port;
  wsc;

  constructor({ host, port }: { host: string; port: number }) {
    super();
    this.host = host;
    this.port = port;

    const url = `ws://${host}:${port}`;

    this.whileInitializing(
      new Promise((resolve) => {
        console.log('asf');
        this.log(`Connecting to ${url}...`);
        this.wsc = new Wsc(url);
        this.wsc.on('open', () => {
          this.log('Connected.');
          resolve(void 0);
        });
      }),
    );
  }
}
Object.assign(WebSocketClient.prototype, {
  _className: 'WebSocketClient',
  _showDebug: true,
});

/*
import { Client as RPCClient } from 'rpc-websockets';
// @ts-ignore
import { actions } from '../../ReduxStore';
import Kernel from '../../../shared/lib/classes/Kernel';
// @ts-ignore
const { receiveEntity } = actions;

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


import Server from './Server';
*/
