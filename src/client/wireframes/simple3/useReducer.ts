export const useReducer = (stateReducer, initialState) => {
  let state = initialState;

  return [
    state,
    (action) => {
      state = stateReducer(state, action);
    },
  ];
};
