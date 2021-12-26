import { Composer, noopNext } from 'middleware-io';
import { PromiseId } from '../../../shared/all';

interface IAction {
  type: string;
  payload: any;
}

type IResponse = IAction;

interface IMessage {
  action: IAction;
  promiseId: string;
  sessionId: string;
}

interface IContext {
  [key: string]: IResponse | IMessage;
}

const mw1 = async (context, next) => {
  context.middleware = true;
  context.response = {
    type: 'NOOP',
    payload: undefined,
  };
  await next();
};

const mw2 = async (context, next) => {
  // @ts-ignore
  context.response.type = 'OP';
  context.response.payload = 'xyzzy';
  await next();
};

const midware = [mw1, mw2];

const composer = new Composer();
midware.forEach((mw) => composer.use(mw));
const middleware = composer.compose();

const msg = <IMessage>{
  action: { type: 'SUBSCRIBE', payload: { me: [], myRelations: { downstreams: null } } },
  promiseId: 'd4f3e58b-4d26-4f09-a02c-a6a941185072',
  sessionId: '89869300-d912-4c40-80c7-dfa5b5e84b31',
};

test('', async () => {
  const context = { message: msg, response: {} };
  await middleware(context, noopNext);
  console.log(context);
});
