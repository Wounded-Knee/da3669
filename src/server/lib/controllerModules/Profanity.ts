import { IControllerModuleServer } from '../../../shared/lib/controllerModules/ControllerModuleInterface';

export default <IControllerModuleServer>{
  middleware: {
    default: async (context, next) => {
      await next();
    },
    filter: async (context, next) => {
      await next();
    },
  },
};
