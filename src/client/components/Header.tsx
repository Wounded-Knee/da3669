/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx } from '@emotion/react';
import { AppBar, Toolbar, Typography, Grid, Button } from '@mui/material';
import { Menu as MenuIcon, Storage as StorageIcon, Info as InfoIcon } from '@mui/icons-material';
import { headerText, clownTitle } from '../config';
import { PassportContext } from './PassportContext';
import { useTheme } from '@mui/styles';
import { store } from '../lib/redux/store';
import { client } from '../../shared/lib/redux/actionTypes';

const { dispatch } = store;

const headerTextArray = headerText.split('');
export const Header: React.FunctionComponent = () => {
  const theme = useTheme();
  const userProfile = useContext(PassportContext);

  const styles = {
    appBar: css`
      background-color: ${theme.palette.secondary.dark};
      border-top: 2px solid ${theme.palette.secondary.dark};
      box-shadow: -1px 22px 7px -19px rgba(0, 0, 0, 0.75) inset;
      text-shadow: black 1px 1px 3px;
      font-weight: bold;
      z-index: 10000;
    `,
    title: css`
      letter-spacing: 0.5em;
      text-align: right;
    `,
    buttons: css`
      color: #fff;
    `,
    toolbar: css`
      min-height: 50px !important;
    `,
  };

  return (
    <AppBar position='fixed' css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        <Grid container alignItems='center'>
          <Grid item xs={1}>
            <Button onClick={() => dispatch({ type: client.DRAWER, payload: ['sideMenu'] })}>
              <MenuIcon css={styles.buttons} />
            </Button>
          </Grid>
          <Grid item xs={10}>
            <Typography variant='h5' noWrap css={styles.title}>
              {
                /*clownTitle
                ? headerTextArray.map((char, index) => {
                    const len = headerTextArray.length;
                    const range = 200;
                    const perChar = range / len;
                    const firstChar = -range * 0.5;
                    return (
                      <span
                        key={index}
                        css={css`
                          color: ${useRainbow(100, 70, firstChar + perChar * index)};
                        `}
                      >
                        {char}
                      </span>
                    );
                  })
                : */ headerText
              }
            </Typography>
          </Grid>
          <Grid item xs={1}>
            {/* User Select */}
            {userProfile.given_name}
          </Grid>
          {/* <Grid item xs={1}>
            <Button onClick={() => core.uiSetDrawer('info')}>
              <InfoIcon css={styles.buttons} />
            </Button>

            <Button onClick={() => core.uiSetDrawer('data')}>
              <StorageIcon css={styles.buttons} />
            </Button>
          </Grid> */}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
