export interface IControllerModuleShared {
  ui: React.FC;
}

export interface IControllerModuleServer {
  middleware: {
    [key: string]: (context: any, next: any) => promise<void>;
  };
}
