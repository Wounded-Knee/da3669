let sockets = [];

export const welcome = (ws) => {
  sockets.push({
    socket: ws,
    dates: {
      create: new Date(),
    },
  });
  return true;
};

export const dismiss = (ws) => {
  sockets = sockets.filter(({ socket }) => socket !== ws);
  return true;
};

export const associateWithSession = (ws, sessionId) => {
  sockets = sockets.map((socket) => {
    return socket.socket === ws
      ? {
          ...socket,
          sessionId,
        }
      : socket;
  });
};
