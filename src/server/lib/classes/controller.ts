import { welcome, dismiss } from './socketManager';
import { Composer, noopNext } from 'middleware-io';
import { inspect } from 'util';
import { decoder } from './controllerModules/decoder';
import { getSession } from './controllerModules/session';
import { actionGetUser } from './controllerModules/user';
import { responseBundler } from './controllerModules/responseBundler';
import { actionCreateNode, actionSelectNodes } from './controllerModules/node';
import { subscriptions } from './controllerModules/subscription';
import { broadcast } from './controllerModules/broadcast';

const debug = {
  eventType: false,
  context: false,
};
type Event = string;
type Payload = any;

const composer = new Composer();
[
  decoder,
  getSession,
  actionGetUser,
  actionCreateNode,
  actionSelectNodes,
  // subscriptions,
  broadcast,
  responseBundler,
].forEach((mw) => composer.use(mw));
const middleware = composer.compose();

export const eventType = Object.freeze({
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  MESSAGE: 'MESSAGE',
});

export const processEvent = async (type: Event, payload: Payload): Promise<any> => {
  if (debug.eventType) console.log(type);
  switch (type) {
    case eventType.OPEN:
      return welcome(payload);

    case eventType.CLOSE:
      return dismiss(payload);

    case eventType.MESSAGE:
      const { ws, message, isBinary } = payload;
      const context = {
        webSocket: ws,
        isBinary,
        message: {
          raw: message,
          decoded: {},
        },
        nodes: {
          created: [],
          updated: [],
          retrieved: [],
        },
        session: {},
        actions: [],
        response: {},
      };
      await middleware(context, noopNext);
      if (debug.context) console.log('Context ', inspect(context, { depth: null }));
      return context.response;
  }
  return false;
};
