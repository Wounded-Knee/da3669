import { client } from '../../../../shared/lib/redux/actionTypes';
import { getSessionById } from '../sessionManager';
import { associateWithSession } from '../socketManager';

const sessions = [];

export const getSession = async (context, next) => {
  context.session = getSessionById(context.message.decoded.sessionId);

  if (context.session) {
    associateWithSession(context.webSocket, context.session.sessionId);
  } else {
    context.actions.push({
      type: client.SESSION_EXPIRED,
    });
  }
  await next();
};
