import { client } from '../../../../shared/lib/redux/actionTypes';
import { getSessions } from '../sessionManager';

export const broadcast = async (context, next): Promise<void> => {
  const {
    nodes: { created, updated },
  } = context;
  const nodes = [...created, ...updated];

  if (nodes.length) {
    getSessions().forEach(({ webSocket }) => {
      webSocket.send(
        JSON.stringify({
          actions: [
            {
              type: client.STASH,
              payload: nodes,
            },
          ],
        }),
      );
    });
  }

  await next();
};
