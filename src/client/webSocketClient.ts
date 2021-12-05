import { WebSocketClient } from './lib/WebSocketClient';
import { WS_SERVER_PORT, WS_SERVER_HOST } from './config';

const url = `ws://${WS_SERVER_HOST}:${WS_SERVER_PORT}`;

export const transport = new WebSocketClient({
  url,
});
