export interface IControllerModuleShared {
  ui: React.FC;
}

export interface IControllerModuleServer {
  controllerMiddleware: (context: any, next: any) => promise<void>;
}
