import WebSocketServer from './lib/WebSocketServer';
import { setWsServer } from './lib/ReduxStore';

export const wsServer = new WebSocketServer();
setWsServer(wsServer);
