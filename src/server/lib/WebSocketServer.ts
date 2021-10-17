import Server from './Server';
import Context from '../../shared/lib/Context';
import { Server as RPCServer } from 'rpc-websockets';
import { compose } from 'middleware-io';
import { server, rpc } from '../../shared/lib/features';
import { WS_SERVER_HOST, WS_SERVER_PORT } from '../config';

class WebSocketServer extends Server {
  webSocketServer;
  core;

  constructor(...args) {
    // @ts-ignore
    super(...args);
    this.core = args[0];
    this.listen();
  }

  command(request, ...args) {
    return new Promise((resolve) => {
      const context = new Context(this.core, request);
      const features = (server || []).map((feature) => feature.bind(context));
      this.log('Composing with features ', features[0], request, args);
      // @ts-ignore
      return compose(features, (context, next) => {
        resolve(context.payload);
        next();
        // @ts-ignore
      })(context, ...args);
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
        rpc.forEach((rpcMethod) => {
          this.log('Registering ' + rpcMethod);
          this.webSocketServer.register(rpcMethod, (...args) => this.command(rpcMethod, ...args));
        });
      }),
    );
  }
}
Object.assign(WebSocketServer.prototype, {
  _className: 'WebSocketServer',
});

export default WebSocketServer;
