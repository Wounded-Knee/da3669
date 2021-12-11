import React, { createContext } from 'react';
import { parse } from 'cookieparser';

const cookies = parse(document.cookie);
const profile = cookies.userProfile ? JSON.parse(cookies.userProfile) : false;

export const PassportContext = createContext(profile);
PassportContext.displayName = 'Passport';

export const PassportProvider = ({ children }) => {
  return <PassportContext.Provider value={profile}>{children}</PassportContext.Provider>;
};
