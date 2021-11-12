import { createSlice, configureStore } from '@reduxjs/toolkit';

let wsServer;
export const setWsServer = (ref) => (wsServer = ref);

const slice = createSlice({
  name: 'slice',
  initialState: {
    entityId: 0,
    entities: [],
  },
  reducers: {
    newEntity: (state, { payload }) => {
      const newEntity = {
        ...payload,
        ver: 0,
        id: state.entityId++,
      };
      state.entities.push(newEntity);
      wsServer.emit('newEntity', newEntity);
    },
  },
});

export const store = configureStore({
  reducer: slice.reducer,
});

export const actions = Object.keys(slice.actions).reduce((actions, actionName) => {
  const action = slice.actions[actionName];
  return {
    ...actions,
    [actionName]: (...args) => {
      return store.dispatch(action(...args));
    },
  };
}, {});

store.subscribe(() =>
  console.log('Latest Entity: ', JSON.stringify(store.getState().entities[store.getState().entities.length - 1])),
);
