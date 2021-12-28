/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Drawer as MuiDrawer } from '@mui/material';
import { connect } from 'react-redux';

const drawerWidth = 350;

const mapStateToProps = (state) => {
  return {
    drawers: state.ui.drawers,
  };
};

export const Drawer: React.FunctionComponent = connect(mapStateToProps)(({ children, drawerName, drawers }) => {
  return (
    <MuiDrawer
      anchor='right'
      variant='persistent'
      open={drawers[drawerName]}
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
});
