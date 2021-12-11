import React, { useState, useEffect, createContext } from 'react';
import { parse } from 'cookieparser';
import { cookieName } from '../config';
import { server } from '../../shared/lib/redux/actionTypes';
import { dispatch } from '../wireframes/experiment1/webSocket';

const cookies = parse(document.cookie);
const sessionId = cookies[cookieName] || false;
const noProfile = {};

export const PassportContext = createContext(noProfile);
PassportContext.displayName = 'Passport';

export const PassportProvider = ({ children }) => {
  const [profile, setProfile] = useState(noProfile);

  useEffect(() => {
    if (sessionId) {
      dispatch({ type: server.GET_USER_BY_SESSION_ID, payload: sessionId }).then(({ payload: userNode }) => {
        console.log('User Node ', userNode);
        setProfile({
          ...userNode,
          sessionId,
        });
      });
    }
  }, [sessionId]);

  return <PassportContext.Provider value={profile}>{children}</PassportContext.Provider>;
};
