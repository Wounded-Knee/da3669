import { ICoreConfig as ISharedCoreConfig, action as sharedAction } from '../shared/all';
import { WebSocketServer } from './classes/WebSocketServer';

export interface ICoreConfig extends ISharedCoreConfig {
  date: {
    serverLoad: Date;
  };
  mongoDB: {
    url: string;
    sslCert: any;
  };
}

export type action = sharedAction;
