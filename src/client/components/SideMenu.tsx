/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { routes } from '../config';

class NavLinkMui extends React.Component<any> {
  render() {
    const { forwardedRef, to, ...props } = this.props;
    return <NavLink {...props} ref={forwardedRef} to={to} />;
  }
}

const drawerWidth = 240;

const mapStateToProps = (state) => ({
  options: state.entities.filter(({ type }) => type !== undefined),
});

export const SideMenu: React.FunctionComponent = connect(mapStateToProps)(({ options }) => {
  const styles = {
    toolbar: css`
      height: 50px;
    `,
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant='permanent'
    >
      <div css={styles.toolbar} />
      <List>
        {routes.map(
          ({ route, icon: Icon, text }, index) =>
            Icon && (
              <ListItem key={index} button component={NavLink} to={route}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ),
        )}
      </List>
      <Divider />
    </Drawer>
  );
});
