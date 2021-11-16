import { ICoreConfig as ISharedCoreConfig } from '../shared/all';
import { WebSocketServer } from './classes/WebSocketServer';

interface ICoreConfig extends ISharedCoreConfig {
  date: {
    serverLoad: Date;
  };
  server: WebSocketServer;
  stateManager: [any, function];
}
