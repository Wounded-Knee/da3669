import React, { useEffect } from 'react';

export function useOnMount(callback) {
  return useEffect(callback, []);
}
