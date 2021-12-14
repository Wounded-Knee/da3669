export const addHelper = (obj) => {
  // @ts-ignore
  window.d3 = {
    // @ts-ignore
    ...window.d3,
    ...obj,
  };
};
