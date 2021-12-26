import { v4 as uuidv4 } from 'uuid';
import { SessionId, UserId } from '../../../shared/all';

interface ISession {
  userId: UserId;
  sessionId: SessionId;
  dates: {
    create: Date;
  };
}

const sessions = [];

export const getSessionById = (sessionId: SessionId): ISession => {
  return sessions.find(({ sessionId: thisSessionId }) => thisSessionId === sessionId);
};

export const createSession = (userId: UserId): ISession => {
  const session = <ISession>{
    userId,
    sessionId: uuidv4(),
    dates: {
      create: new Date(),
    },
  };
  sessions.push(session);
  return session;
};
