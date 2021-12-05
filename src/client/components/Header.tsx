/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { AppBar, Toolbar, Typography, Grid, Button } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';
import { headerText, clownTitle } from '../config';
import { useRainbow } from '../lib/useRainbow';

const headerTextArray = headerText.split('');
export const Header: React.FunctionComponent = () => {
  const styles = {
    appBar: css`
      background-color: ${useRainbow()};
      border-top: 2px solid ${useRainbow(100, 60)};
      box-shadow: -1px 29px 34px -19px rgba(0, 0, 0, 0.75) inset;
      text-shadow: black 1px 1px 3px;
      font-weight: bold;
      z-index: 10000;
    `,
    title: css`
      letter-spacing: 0.5em;
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
          <Grid item xs={10}>
            <Typography variant='h5' noWrap css={styles.title}>
              {clownTitle
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
                : headerText}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            {/* User Select */}
          </Grid>
          <Grid item xs={1}>
            <Button onClick={() => core.uiSetDrawer('info')}>
              <InfoIcon css={styles.buttons} />
            </Button>

            <Button onClick={() => core.uiSetDrawer('data')}>
              <StorageIcon css={styles.buttons} />
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
