import { client } from '../../../shared/lib/redux/actionTypes';
import { getSessions } from '../classes/sessionManager';
import { IControllerModuleServer } from '../../../shared/lib/controllerModules/ControllerModuleInterface';

export default <IControllerModuleServer>{
  middleware: {
    default: async (context, next) => {
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
    },
  },
};
