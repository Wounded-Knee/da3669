/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Link as MuiLink } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { routes } from '../routes';
import { useSelector, useDispatch } from 'react-redux';
import { getDrawerState } from '../wireframes/experiment1/selectors';
import { client } from '../../shared/lib/redux/actionTypes';

class NavLinkMui extends React.Component<any> {
  render() {
    const { forwardedRef, to, ...props } = this.props;
    return <NavLink {...props} ref={forwardedRef} to={to} />;
  }
}

const drawerWidth = 240;

export const SideMenu: React.FunctionComponent = () => {
  const styles = {
    toolbar: css`
      height: 50px;
    `,
  };

  const mobileOpen = useSelector(() => getDrawerState('sideMenu'));
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    dispatch({ type: client.DRAWER, payload: ['sideMenu'] });
  };

  const drawerContents = (
    <>
      <div css={styles.toolbar} />
      <List>
        {routes.map(
          ({ route, icon: Icon, text, express }, index) =>
            Icon && (
              <ListItem
                key={index}
                onClick={() => dispatch({ type: client.DRAWER, payload: ['sideMenu', false] })}
                button
                component={express ? MuiLink : NavLink}
                {...{ [express ? 'href' : 'to']: route }}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ),
        )}
      </List>
      <Divider />
    </>
  );

  return (
    <>
      <Drawer
        variant='temporary'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContents}
      </Drawer>
      <Drawer
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='permanent'
      >
        {drawerContents}
      </Drawer>
    </>
  );
};
