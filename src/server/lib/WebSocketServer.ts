import Server from './Server';
import ServerStore from './ServerStore';
import Context from '../../shared/lib/Context';
import { compose } from 'middleware-io';
import { server, rpc } from '../../shared/lib/features';
const store = new ServerStore({ db: './db.json' });

const command = (request, ...args) => {
  const context = new Context(request);
  const mixins = (server || []).map((mixin) => mixin.bind(context));
  // @ts-ignore
  return compose(mixins)(context, ...args);
};

class WebSocketServer extends Server {}

export default WebSocketServer;
