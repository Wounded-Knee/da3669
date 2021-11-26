import React from 'react';
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import { NavLink, Link } from 'react-router-dom';
import { getComponentByType } from '../components/entities';
import { connect } from 'react-redux';
import { QuestionAnswer, Article } from '@mui/icons-material';

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

export const SideMenu: React.FunctionComponent<{ core: any }> = connect(mapStateToProps)(({ core, options }) => {
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
        <ListItem button component={NavLinkMui} to='/docstore'>
          <ListItemIcon>
            <Article />
          </ListItemIcon>
          <ListItemText primary='Doc Store' />
        </ListItem>

        {options &&
          options.map(({ id, text, type }, index) => (
            <ListItem key={index} button component={NavLinkMui} to={`/${id}`}>
              <ListItemIcon>{getComponentByType(type).icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
      </List>

      <Divider />
    </Drawer>
  );
});
