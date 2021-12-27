import { WebSocket } from 'uWebSockets.js';

let sockets = [];

export const welcome = (ws: WebSocket): boolean => {
  sockets.push({
    socket: ws,
    dates: {
      create: new Date(),
    },
  });
  return true;
};

export const dismiss = (ws: WebSocket): boolean => {
  sockets = sockets.filter(({ socket }) => socket !== ws);
  return true;
};
