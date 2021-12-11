/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { FC } from 'react';
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

store.subscribe(() => {
  const { user, ui } = store.getState();
  set(appName, { ui, user });
});

const styles = {
  root: css`
    display: flex;
  `,
  main: css`
    flex-grow: 1;
    height: 100vh;
  `,
  vignette: css`
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
  `,
  toolbar: css`
    min-height: 50px;
  `,
};

export const App: FC = () => {
  return (
    <BrowserRouter>
      <div css={styles.root}>
        <CssBaseline />
        <Header />
        <SideMenu />
        <DataView />
        <InfoView />
        <main css={styles.main}>
          <div css={styles.toolbar} />
          <Box
            css={styles.vignette}
            sx={{
              padding: { xs: '1em', sm: '3em' },
            }}
          >
            <Routes>
              {routes.map(({ path, component: Component }, index) => (
                <Route key={index} path={path} element={<Component />} />
              ))}
            </Routes>
          </Box>
        </main>
      </div>
    </BrowserRouter>
  );
};
