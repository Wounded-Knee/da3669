import { ICoreConfig as ISharedCoreConfig, IState as ISharedState, dispatch, action } from '../shared/all';

export type action = action;

export interface IState extends ISharedState {
  user: {
    id: number;
  };
  ui: {
    drawers: {
      [key: string]: boolean;
    };
  };
}

export interface ICoreConfig extends ISharedCoreConfig {
  client: any;
  store: any;
  date: {
    uiRender: Date;
    uiLoad: Date;
  };
}
