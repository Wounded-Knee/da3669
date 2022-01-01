import { client } from '../../../shared/lib/redux/actionTypes';
import { getSessionById, associateWebSocket } from '../classes/sessionManager';

export const getSession = async (context, next): Promise<void> => {
  context.session = getSessionById(context.message.decoded.sessionId);

  if (context.session) {
    associateWebSocket(context.session.sessionId, context.webSocket);
  } else {
    context.actions.push({
      type: client.SESSION_EXPIRED,
    });
  }
  await next();
};
