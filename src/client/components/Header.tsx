/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { AppBar, Toolbar, Typography, Grid, Button } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';
import React from 'react';
import { headerText } from '../config';
import { useRainbow } from '../lib/useRainbow';

export const Header: React.FunctionComponent = () => {
  const styles = {
    appBar: css`
      background-color: ${useRainbow()};
      text-shadow: black 1px 1px 3px;
      font-weight: bold;
      letter-spacing: 1em;
      z-index: 10000;
    `,
    dataButton: css`
      text-align: right;
    `,
    toolbar: css`
      min-height: 50px !important;
    `,
  };
  return (
    <AppBar position='fixed' css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        <Grid container alignItems='center'>
          <Grid item xs={10}>
            <Typography variant='h5' noWrap>
              {headerText}
            </Typography>
          </Grid>
          <Grid item xs={1} css={styles.dataButton}>
            {/* User Select */}
          </Grid>
          <Grid item xs={1} css={styles.dataButton}>
            <Button onClick={() => core.uiSetDrawer('info')}>
              <InfoIcon />
            </Button>

            <Button onClick={() => core.uiSetDrawer('data')}>
              <StorageIcon />
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
