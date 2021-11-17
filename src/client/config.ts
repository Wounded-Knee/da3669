import { initialState as sharedInitialState } from '../shared/config';

export const initialState = {
  ...sharedInitialState,
  user: {
    id: null,
  },
  ui: {
    drawers: {
      info: false,
      data: false,
    },
    selectedEntityIndex: null,
    selectedEntityHistory: [],
  },
};
