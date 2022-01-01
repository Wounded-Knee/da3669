import { server, client } from '../../../shared/lib/redux/actionTypes';
import { getUserById } from '../classes/userManager';

export const actionGetUser = async (context, next) => {
  const {
    session,
    message: {
      decoded: {
        action: { type, payload },
      },
    },
  } = context;

  if (type === server.GET_USER) {
    if (session) {
      const { userId } = session;
      if (userId) {
        context.actions.push({
          type: client.STASH,
          payload: await getUserById(userId),
        });
      }
    }
  }
  await next();
};
