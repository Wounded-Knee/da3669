/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { AppBar, Toolbar, Typography, Grid, Button } from '@material-ui/core';
import StorageIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';
import React from 'react';
import { UserSelect } from './UserSelect';
import { appName } from '../config';
import { getAnimationCss } from './Branded';

export const Header: React.FunctionComponent = () => {
  const styles = {
    appBar: css`
      ${getAnimationCss('background-color')}
      z-index: 10000;
    `,
    dataButton: css`
      text-align: right;
    `,
    toolbar: css`
      min-height: 50px;
    `,
  };
  return (
    <AppBar position='fixed' css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        <Grid container alignItems='center'>
          <Grid item xs={10}>
            <Typography variant='h5' noWrap>
              🙃 {appName} Prototype
            </Typography>
          </Grid>
          <Grid item xs={1} css={styles.dataButton}>
            <UserSelect users={[]} onSubmit={console.log} />
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
