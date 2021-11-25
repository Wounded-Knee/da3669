import { core } from '../../core';

const { transport } = core;

export default (action) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      transport
        .call('execute', action)
        .then((returnValue) => {
          const { action } = returnValue;
          if (action) {
            console.log('Dispatching local action ', action);
            dispatch(action);
          } else {
            console.log('Server returned no action.');
          }
          resolve(returnValue);
        })
        .catch((...args) => reject(...args));
    });
  };
};
