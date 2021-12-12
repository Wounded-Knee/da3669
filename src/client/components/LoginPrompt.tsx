/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Google as GoogleIcon } from '@mui/icons-material';
import { Typography, Grid } from '@mui/material';
import { Link } from '@mui/material';
import { BrandScreen } from './BrandScreen';

export const LoginPrompt = () => {
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
