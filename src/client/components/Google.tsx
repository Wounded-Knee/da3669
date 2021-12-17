/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Google as GoogleIcon } from '@mui/icons-material';
import { Typography, Grid } from '@mui/material';
import { Link } from '@mui/material';
import { BrandScreen } from './BrandScreen';
import { appName } from '../config';
import { useParams } from 'react-router-dom';

export const Google = () => {
  const { message } = useParams();
  return (
    <Link href={'/google'} underline='none'>
      <BrandScreen speed={15}>
        <Grid container spacing={1} direction='row' justifyContent='center' alignItems='center'>
          <Grid item>
            <GoogleIcon sx={{ fontSize: 20 }} />
          </Grid>
          <Grid item>
            <Typography variant='h5' noWrap>
              Sorry.
            </Typography>
          </Grid>
        </Grid>
        <p>You haven&apos;t been authorized to access {appName} yet. Contact ɐʞoʎǝH for help.</p>
      </BrandScreen>
    </Link>
  );
};
