let records = [];

// Call this on every socket message.
// It freshens existing records
// It registers non-existing records
export const registerSocket = (socket, userId) => {
  if (getRecordsBySocket(socket).length) {
    records = records.map((record) => {
      const { socket: thisSocket, userId: thisUserId, created, lastUsed } = record;
      if (thisSocket === socket) {
        return {
          socket,
          userId,
          created,
          lastUsed: Date.now(),
        };
      } else {
        return record;
      }
    });
  } else {
    records.push({
      socket,
      userId,
      created: Date.now(),
      lastUsed: Date.now(),
    });
  }

  console.log('Socket Registry: ', records);
};

export const getRecordsByUserId = (userId) => {
  return records.filter(({ userId: thisUserId }) => userId === thisUserId);
};

export const getRecordsBySocket = (socket) => {
  return records.filter(({ socket: thisSocket }) => socket === thisSocket);
};

export const getSocketsByUserId = (userId) => {
  return getRecordsByUserId(userId).map(({ socket }) => socket);
};
