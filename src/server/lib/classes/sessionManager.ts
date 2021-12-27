import { WebSocket } from 'uWebSockets.js';
import { v4 as uuidv4 } from 'uuid';
import { SessionId, UserId } from '../../../shared/all';
import { ObjectId } from 'mongoose';

export interface ISubscription {
  id?: ObjectId;
  rel?: {
    [key: string]: ObjectId;
  };
  dates: {
    create: Date;
  };
}

interface ISession {
  userId: UserId;
  webSocket: WebSocket;
  sessionId: SessionId;
  subscriptions: ISubscription[];
  dates: {
    create: Date;
  };
}

let sessions = [];

export const getSessionById = (sessionId: SessionId): ISession => {
  return sessions.find(({ sessionId: thisSessionId }) => thisSessionId === sessionId);
};

export const getSessions = (): ISession[] => sessions;

export const associateWebSocket = (sessionId: SessionId, ws: WebSocket): void => {
  sessions = sessions.map((session) => {
    return session.sessionId === sessionId
      ? {
          ...session,
          webSocket: ws,
        }
      : session;
  });
};

export const createSession = (userId: UserId): ISession => {
  const session = <ISession>{
    userId,
    sessionId: uuidv4(),
    subscriptions: [],
    dates: {
      create: new Date(),
    },
  };
  sessions.push(session);
  return session;
};

export const addSubscription = (sessionId: SessionId, subscription: ISubscription): void => {
  sessions = sessions.map((session) => {
    return session.sessionId === sessionId
      ? {
          ...session,
          subscriptions: [
            ...session.subscriptions,
            {
              ...subscription,
              dates: {
                create: new Date(),
              },
            },
          ],
        }
      : session;
  });
};

export const removeSubscription = (sessionId: SessionId, subscription: ISubscription): void => {
  sessions = sessions.map((session) => {
    return session.sessionId === sessionId
      ? {
          ...session,
          subscriptions: session.subscriptions.filter((thisSubscription) => {
            return JSON.stringify(subscription) !== JSON.stringify(thisSubscription);
          }),
        }
      : session;
  });
};
