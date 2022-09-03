import React from 'react';
import { BrandScreen } from './BrandScreen';

export const Panic: React.FunctionComponent = () => {
  return (
    <BrandScreen speed={1.5} brand='☻'>
      don't panic
    </BrandScreen>
  );
};
