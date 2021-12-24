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
