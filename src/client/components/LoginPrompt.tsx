/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Google as GoogleIcon } from '@mui/icons-material';
import { Typography, Grid } from '@mui/material';
import { Link } from '@mui/material';

export const LoginPrompt = () => {
  return (
    <Link href={'/google'} underline='none'>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
        css={css`
          text-align: center;
          margin-bottom: 50%;
        `}
      >
        <Grid item xs={12}>
          <GoogleIcon sx={{ fontSize: 140 }} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h2' noWrap>
            Log in
          </Typography>
        </Grid>
      </Grid>
    </Link>
  );
};
