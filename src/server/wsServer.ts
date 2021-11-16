import WebSocketServer from './lib/old/WebSocketServer';
import { setWsServer } from './lib/old/ReduxStore';

export const wsServer = new WebSocketServer();
setWsServer(wsServer);
