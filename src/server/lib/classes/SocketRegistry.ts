let records = [];
const socketUsageDataCap = 100;
const debug = {
  registryContents: false,
};

// Call this on every socket message.
// It freshens existing records
// It registers non-existing records
export const registerSocket = (socket, userId, sessionId) => {
  if (getRecordsBySocket(socket).length) {
    records = records.map((record) => {
      const { socket: thisSocket } = record;
      if (thisSocket === socket) {
        return {
          ...record,
          dates: {
            ...record.dates,
            uses: [Date.now(), ...record.dates.uses.splice(0, socketUsageDataCap - 1)],
          },
        };
      } else {
        return record;
      }
    });
  } else {
    records.push({
      socket,
      userId,
      sessionId,
      dates: {
        created: Date.now(),
        uses: [Date.now()],
      },
    });
  }

  if (debug.registryContents) console.log('Socket Registry: ', records);
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

export const broadcastTo = (userIdArray, action) => {};
