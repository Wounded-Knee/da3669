/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Google as GoogleIcon } from '@mui/icons-material';
import { Typography, Grid } from '@mui/material';
import { Link } from '@mui/material';
import { BrandScreen } from './BrandScreen';
import { autoLogin } from '../config';
import { useOnMount } from '../lib/useOnMount';

export const LoginPrompt = () => {
  useOnMount(() => {
    if (autoLogin) {
      console.log('Auto-Login Enabled');
      window.location.href = '/google';
    }
  });

  return (
    <Link href={'/google'} underline='none'>
      <BrandScreen speed={15}>
        <Grid container spacing={1} direction='row' justifyContent='center' alignItems='center'>
          <Grid item>
            <GoogleIcon sx={{ fontSize: 20 }} />
          </Grid>
          <Grid item>
            <Typography variant='h5' noWrap>
              Login
            </Typography>
          </Grid>
        </Grid>
      </BrandScreen>
    </Link>
  );
};
