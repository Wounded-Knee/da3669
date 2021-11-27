import React from 'react';
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
  }),
);

const mapStateToProps = (state) => ({
  options: state.entities.filter(({ type }) => type !== undefined),
});

export const SideMenu: React.FunctionComponent = connect(mapStateToProps)(({ options }) => {
  const classes = useStyles({});

  return (
    <Drawer
      className={classes.drawer}
      variant='permanent'
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List>
        {routes.map(
          ({ route, icon: Icon, text }, index) =>
            Icon && (
              <ListItem key={index} button component={NavLinkMui} to={route}>
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
