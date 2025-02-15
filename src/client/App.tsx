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
import { TopMenu } from './components/TopMenu';
import { DataView } from './components/DataView';
import { InfoView } from './components/InfoView';
import { PassportContext } from './components/PassportContext';
import { LoginPrompt } from './components/LoginPrompt';
import { Google } from './components/Google';

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
            <TopMenu />
            <DataView />
            <InfoView />
          </>
        )}
        <Box
          css={css`
            display: flex;
            flex-wrap: nowrap;
            flex-direction: column-reverse;
            justify-content: start;
            align-items: stretch;
            align-content: start

            background: #333;
            box-shadow: inset 0 0 100px black;

            &:after {
              display: block;
              content: ' ';
              flex: 999 999 auto;
            }
          `}
          sx={{
            padding: { xs: '1em', sm: '3em' },
            marginTop: '47px', // Header
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
            <Routes>
              <Route path='/google/:message' element={<Google />} />
              <Route path='*' element={<LoginPrompt />} />
            </Routes>
          )}
        </Box>
      </Box>
    </BrowserRouter>
  );
};
