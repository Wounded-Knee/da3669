import { ICoreConfig as ISharedCoreConfig, action as sharedAction } from '../shared/all';
import { WebSocketServer } from './classes/WebSocketServer';

export interface ICoreConfig extends ISharedCoreConfig {
  date: {
    serverLoad: Date;
  };
}

export type action = sharedAction;
