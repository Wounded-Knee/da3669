import Server from './Server';
import Context from '../../shared/lib/Context';
import { Server as RPCServer } from 'rpc-websockets';
import { compose } from 'middleware-io';
//import { server, rpc } from '../../shared/lib/features';
import { WS_SERVER_HOST, WS_SERVER_PORT } from '../config';

class WebSocketServer extends Server {
  webSocketServer;
  core;

  constructor(core) {
    // @ts-ignore
    super(core);
    this.core = core;
    this.listen();
  }

  command(request, ...args) {
    const [props, code] = args;
    return new Promise((resolve) => {
      const context = new Context(this.core, request, ...props);
      context.code = code;
      /*
      const features = (server || []).map((feature) => feature.bind(context));
      this.log('Composing with features ', features[0], request, code, props);
      // @ts-ignore
      return compose(features)(context, ({ payload }, next) => {
        this.log('Payload: ' + payload);
        resolve(payload);
        next();
      });
      */
    });
  }

  listen() {
    this.whileInitializing(
      new Promise((resolve) => {
        this.webSocketServer = new RPCServer({
          port: WS_SERVER_PORT,
          host: WS_SERVER_HOST,
        });
        this.webSocketServer.on('listening', () => {
          this.log('Listening');
          resolve(void 0);
        });
        /*
        Object.keys(rpc).forEach((rpcMethod) => {
          this.log('Registering ' + rpcMethod);
          this.webSocketServer.register(rpcMethod, (...args) => this.command(rpcMethod, ...args));
        });
        */
      }),
    );
  }
}
Object.assign(WebSocketServer.prototype, {
  _className: 'WebSocketServer',
});

export default WebSocketServer;
