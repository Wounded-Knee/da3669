import { SelectorProfile } from '../../shared/all';

export const addHelper = (obj) => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.d3 = {
      // @ts-ignore
      ...window.d3,
      ...obj,
    };
  }
};

export const inspectSelectorProfile = (selectorProfile: SelectorProfile) => {
  return selectorProfile.map((item) => item.toString());
};
