import React from 'react';
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { QuestionAnswer } from '@material-ui/icons';
import DefaultIcon from '@material-ui/icons/Accessibility';
import { createStyles, Theme } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';

import data from '../wireframes/mockdata';
import { entityTypes } from '../../shared/lib/classes/entities';

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

export const SideMenu: React.FunctionComponent<{ core: any }> = ({ core }) => {
  const classes = useStyles({});
  const options = core.getEntitiesByType(entityTypes.MESSAGE);

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
        {options &&
          options.map(({ id, text }, index) => (
            <ListItem key={index} button component={NavLinkMui} to={`/entity/${id}`}>
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
      </List>
    </Drawer>
  );
};
