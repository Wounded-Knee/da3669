import { server } from '../../../../shared/lib/redux/actionTypes';
import { addSubscription, ISubscription, removeSubscription } from '../sessionManager';

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
      addSubscription(sessionId, <ISubscription>payload);
    } else if (type === server.UNSUBSCRIBE) {
      removeSubscription(sessionId, <ISubscription>payload);
    }
  }

  await next();
};
