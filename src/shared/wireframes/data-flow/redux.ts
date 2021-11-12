import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Entity, Text, Classification, Avatar } from '../../lib/Entities';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    entityId: 0,
    entities: [],
  },
  reducers: {
    newEntity: (state, { payload }) => {
      state.entities.push({
        ...payload,
        id: state.entityId++,
      });
    },

    incremented: (state, { type, payload }) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decremented: (state) => {
      state.value -= 1;
    },
  },
});

export const { newEntity, incremented, decremented } = counterSlice.actions;

const store = configureStore({
  reducer: counterSlice.reducer,
});

// Can still subscribe to the store
store.subscribe(() => console.log(JSON.stringify(store.getState().entities[store.getState().entities.length - 1])));

const test = () => {
  console.log('Redux ready');

  /*
  // Still pass action objects to `dispatch`, but they're created for us
  store.dispatch(incremented(451));
  // {value: 1}
  store.dispatch(incremented(0));
  // {value: 2}
  store.dispatch(decremented());
  // {value: 1}

  console.log('Text Entity ', Text('Blathersnitch'));
  console.log('Avatar Entity ', Avatar('James Naples'));
  console.log('Classification Entity ', Classification('Racist', 'This is racist.'));
  */

  store.dispatch(newEntity(Avatar('Jim Bob')));
  store.dispatch(newEntity(Text('I like lolipops.')));
};

export { test };
