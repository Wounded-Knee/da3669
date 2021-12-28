/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Drawer as MuiDrawer } from '@mui/material';
import { useSelector } from 'react-redux';

const drawerWidth = 350;

export const Drawer: React.FunctionComponent = ({ children, drawerName }) => {
  const drawerState = useSelector((state) => state.ui.drawers[drawerName]);
  return (
    <MuiDrawer
      anchor='right'
      variant='persistent'
      open={drawerState}
      onClose={() => core.uiSetDrawer(drawerName, false)}
    >
      <div
        css={css`
          minheight: 50px;
        `}
      ></div>

      {children}
    </MuiDrawer>
  );
};
