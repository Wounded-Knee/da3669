import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import UsageIcon from '@material-ui/icons/Code';
import HomeIcon from '@material-ui/icons/Home';
import RouterIcon from '@material-ui/icons/Storage';
import FetchIcon from '@material-ui/icons/CloudDownload';
import StyledIcon from '@material-ui/icons/Style';
import LazyIcon from '@material-ui/icons/SystemUpdateAlt';
import DefaultIcon from '@material-ui/icons/Accessibility';
import QuestionIcon from '@material-ui/icons/QuestionAnswer';
import React from 'react';
import { NavLink } from 'react-router-dom';

import data from '../wireframes/mockdata';
import { UserSelect } from '../wireframes/simple3/userselect';
import { TYPE_USER, TYPE_MESSAGE } from '../wireframes/simple3/core';
import { QuestionAnswer } from '@material-ui/icons';

const { routes } = data;

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

export const SideMenu: React.FunctionComponent = ({ core }) => {
  const classes = useStyles({});
  const users = core.getByType(TYPE_USER);
  const options = core.getByType(TYPE_MESSAGE).filter(({ mother }) => mother === undefined);
  const currentUser = core.user;
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
        <ListItem>
          <UserSelect users={users} currentUser={currentUser} onSubmit={(userID) => (core.user = userID)} />
        </ListItem>

        {options.map(({ id, text }, index) => (
          <ListItem key={index} button component={NavLinkMui} to={`/message/${id}`}>
            <ListItemIcon>
              <QuestionAnswer />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {routes.map(({ menu, route }, index) => (
          <ListItem key={index} button component={NavLinkMui} to={`/${route}`}>
            <ListItemIcon>
              <DefaultIcon />
            </ListItemIcon>
            <ListItemText primary={menu} />
          </ListItem>
        ))}
        {/*
        <ListItem button component={NavLinkMui} to='/fetch-example'>
          <ListItemIcon>
            <FetchIcon />
          </ListItemIcon>
          <ListItemText primary='Fetch' />
        </ListItem>
        <ListItem button component={NavLinkMui} to='/lazy-example'>
          <ListItemIcon>
            <LazyIcon />
          </ListItemIcon>
          <ListItemText primary='Lazy Loading' />
        </ListItem>
        <ListItem button component={NavLinkMui} to='/styled-example'>
          <ListItemIcon>
            <StyledIcon />
          </ListItemIcon>
          <ListItemText primary='Styled Components' />
        </ListItem>
        <ListItem button component={NavLinkMui} to='/router-example/1234'>
          <ListItemIcon>
            <RouterIcon />
          </ListItemIcon>
          <ListItemText primary='React-Router' />
        </ListItem>
        */}
      </List>
    </Drawer>
  );
};
