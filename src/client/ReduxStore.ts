import { createSlice, configureStore } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'slice',
  initialState: {
    entityId: 0,
    entities: [],
  },
  reducers: {
    receiveEntity: (state, { payload }) => {
      state.entities = [...state.entities.filter((entity) => entity.id !== payload.id), payload];
    },
  },
});

export const store = configureStore({
  reducer: slice.reducer,
});

export const actions = Object.keys(slice.actions).reduce((actions, actionName) => {
  const action = slice.actions[actionName];
  return { ...actions, [actionName]: (...args) => store.dispatch(action(...args)) };
}, {});
