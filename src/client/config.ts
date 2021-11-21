import { WS_SERVER_HOST, WS_SERVER_PORT, initialState as sharedInitialState } from '../shared/config';

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
    ready: {
      webSocket: false,
    },
    selectedEntityIndex: null,
    selectedEntityHistory: [],
  },
};

export { WS_SERVER_PORT, WS_SERVER_HOST };
