/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx } from '@emotion/react';
import { AppBar, Toolbar, Typography, Grid, Button } from '@mui/material';
import {
  Menu as MenuClosedIcon,
  MenuOpen as MenuOpenIcon,
  Storage as StorageIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { headerText, appName, clownTitle } from '../config';
import { PassportContext } from './PassportContext';
import { useTheme } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { client } from '../../shared/lib/redux/actionTypes';

const headerTextArray = headerText.split('');
export const Header: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const userProfile = useContext(PassportContext);
  const color = theme.palette.secondary.dark;

  const styles = {
    appBar: css`
      ${!userProfile._id &&
      `
        background-image: none;
        box-shadow: 0 0 5px black;
      `}
      background-color: ${userProfile._id ? color : 'transparent'};
      border-top: 2px solid ${color};
      box-shadow: -1px 22px 7px -19px rgba(0, 0, 0, 0.75) inset;
      text-shadow: black 1px 1px 3px;
      font-weight: bold;
      z-index: 10000;
      border-radius: 0 0 0.5em 0.5em;
    `,
    title: css`
      letter-spacing: ${headerText.length > 4 ? '0.5em' : 'inherit'};
      text-align: right;
    `,
    buttons: css`
      cursor: pointer;
      color: #fff;
    `,
    toolbar: css`
      min-height: 50px !important;
    `,
  };

  const MenuIcon = useSelector((state) => state.ui.drawers['sideMenu']) ? MenuOpenIcon : MenuClosedIcon;

  return (
    <AppBar position='fixed' css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        {userProfile._id && (
          <Grid container alignItems='center'>
            <Grid item xs={1}>
              <MenuIcon
                onClick={() => dispatch({ type: client.DRAWER, payload: ['sideMenu'] })}
                sx={{
                  display: { xs: 'block', sm: 'none' },
                }}
                css={styles.buttons}
              />
            </Grid>
            <Grid item xs={11}>
              <Typography variant='h5' noWrap css={styles.title}>
                {!userProfile._id && appName}
                {userProfile.name}{' '}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Toolbar>
    </AppBar>
  );
};
