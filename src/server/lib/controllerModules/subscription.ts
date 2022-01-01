import { server } from '../../../shared/lib/redux/actionTypes';
import { addSubscription, ISubscription, removeSubscription } from '../classes/sessionManager';

const debug = {
  [server.SUBSCRIBE]: true,
};

export const subscriptions = async (context, next): Promise<void> => {
  const {
    session,
    message: {
      decoded: {
        action: { type, payload },
      },
    },
  } = context;

  if (session) {
    const { sessionId } = session;
    if (type === server.SUBSCRIBE) {
      if (debug[server.SUBSCRIBE]) console.log(type, payload);
      addSubscription(sessionId, <ISubscription>payload);
    } else if (type === server.UNSUBSCRIBE) {
      removeSubscription(sessionId, <ISubscription>payload);
    }
  }

  await next();
};
