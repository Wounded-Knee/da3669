import { IControllerModuleServer } from '../../../shared/lib/controllerModules/ControllerModuleInterface';

export default <IControllerModuleServer>{
  controllerMiddleware: async (context, next) => {
    await next();
  },
};
