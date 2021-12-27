import { welcome, dismiss } from './socketManager';
import { Composer, noopNext } from 'middleware-io';
import { inspect } from 'util';
import { decoder } from './controllerModules/decoder';
import { getSession } from './controllerModules/session';
import { actionGetUser } from './controllerModules/user';
import { responseBundler } from './controllerModules/responseBundler';
import { actionCreateNode } from './controllerModules/node';
import { subscriptions } from './controllerModules/subscription';

type Event = string;
type Payload = any;

const composer = new Composer();
[decoder, getSession, actionGetUser, actionCreateNode, subscriptions, responseBundler].forEach((mw) =>
  composer.use(mw),
);
const middleware = composer.compose();

export const eventType = Object.freeze({
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  MESSAGE: 'MESSAGE',
});

export const processEvent = async (type: Event, payload: Payload): Promise<any> => {
  console.log(type);
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
        session: {},
        actions: [],
        response: {},
      };
      await middleware(context, noopNext);
      console.log('Context ', inspect(context, { depth: null }));
      return context.response;
  }
  return false;
};
