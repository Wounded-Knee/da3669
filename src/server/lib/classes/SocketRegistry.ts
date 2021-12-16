import { WebSocket } from 'uWebSockets.js';

let records = [];
const socketUsageDataCap = 100;
const debug = {
  registryContents: false,
};

export interface ISocketRecord {
  socket: WebSocket;
  userId: string;
  sessionId: string;
  dates: {
    created: Date;
    uses: Date[];
  };
}

// Call this on every socket message.
// It freshens existing records
// It registers non-existing records
export const registerSocket = (socket: WebSocket, userId: string, sessionId: string) => {
  if (getRecordsBySocket(socket).length) {
    records = records.map((record) => {
      const { socket: thisSocket } = record;
      if (thisSocket === socket) {
        return {
          ...record,
          dates: {
            ...record.dates,
            uses: [new Date(), ...record.dates.uses.splice(0, socketUsageDataCap - 1)],
          },
        };
      } else {
        return record;
      }
    });
  } else {
    records.push(<ISocketRecord>{
      socket,
      userId,
      sessionId,
      dates: {
        created: new Date(),
        uses: [new Date()],
      },
    });
  }

  if (debug.registryContents) console.log('Socket Registry: ', records);
};

export const getRecordsByUserId = (userId) => {
  return records.filter(({ userId: thisUserId }) => userId === thisUserId);
};

export const getRecordsBySocket = (socket: WebSocket) => {
  return records.filter(({ socket: thisSocket }) => socket === thisSocket);
};

export const getSocketsByUserId = (userId) => {
  return getRecordsByUserId(userId).map(({ socket }) => socket);
};

export const broadcastTo = (userIdArray, action) => {};
