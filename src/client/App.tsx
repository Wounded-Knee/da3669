/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { FC, useContext } from 'react';
import { css, jsx } from '@emotion/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { appName } from './config';
import { set } from './lib/LocalStorage';
import { store } from './lib/redux/store';
import { routes } from './routes';

// MUI
import { CssBaseline } from '@mui/material';
import { Box } from '@mui/material';

// Components
import { Header } from './components/Header';
import { SideMenu } from './components/SideMenu';
import { DataView } from './components/DataView';
import { InfoView } from './components/InfoView';
import { PassportContext } from './components/PassportContext';
import { LoginPrompt } from './components/LoginPrompt';

store.subscribe(() => {
  const { user, ui } = store.getState();
  set(appName, { ui, user });
});

export const App: FC = () => {
  const userProfile = useContext(PassportContext);
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header />
        {userProfile._id && (
          <>
            <SideMenu />
            <DataView />
            <InfoView />
          </>
        )}
        <Box
          css={css`
            flex-grow: 1;
            height: 100vh;
            background: #333;
            box-shadow: inset 0 0 100px black;
            padding: 3em;
            min-height: 100vh;
            display: flex;
            flex-wrap: nowrap;
            flex-direction: column;
            justify-content: start;
            align-items: auto;
            align-content: start;

            &:before {
              display: block;
              content: ' ';
              flex: 999 999 auto;
            }
          `}
          sx={{
            padding: { xs: '1em', sm: '3em' },
          }}
        >
          {userProfile._id ? (
            <Routes>
              {routes.map(
                ({ path, component: Component }, index) =>
                  Component && <Route key={index} path={path} element={<Component />} />,
              )}
            </Routes>
          ) : (
            <LoginPrompt />
          )}
        </Box>
      </Box>
    </BrowserRouter>
  );
};
