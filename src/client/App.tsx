/** @jsxFrag React.Fragment */
/** @jsx jsx */
// App
import React, { FC } from 'react';
import { css, jsx } from '@emotion/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Pages
import { appName } from './config';
import { set } from './lib/LocalStorage';
import { store } from './lib/redux/store';
import { routes } from './routes';

// MUI
import { CssBaseline } from '@mui/material';

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
    background: #222;
    box-shadow: inset 0 0 100px black;
    padding: 3em;
    min-height: 100vh;
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
          <div css={styles.vignette}>
            <Routes>
              {routes.map(({ path, component: Component }, index) => (
                <Route key={index} path={path} element={<Component />} />
              ))}
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};
