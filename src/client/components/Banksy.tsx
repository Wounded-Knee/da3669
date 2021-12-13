/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { useSelector } from 'react-redux';
import { getNetWorth } from '../lib/redux/selectors';

export const Bank = () => {
  const netWorth = useSelector(getNetWorth);

  return (
    <>
      <h1>Bank</h1>
      <p>Net Worth: {netWorth}</p>
    </>
  );
};

export default Bank;
