import { appName, WS_SERVER_HOST, WS_SERVER_PORT, initialState as sharedInitialState } from '../shared/config';
import { get } from './lib/LocalStorage';

const localState = get(appName) || { ui: { drawers: {} } };

export const initialState = {
  ...sharedInitialState,
  documents: [],
  user: {
    id: null,
  },
  ui: {
    ...localState.ui,
    drawers: {
      info: false,
      data: false,
      ...localState.ui.drawers,
    },
    ready: {
      webSocket: false,
    },
    selectedEntityIndex: null,
    selectedEntityHistory: [],
  },
};

export { appName, WS_SERVER_PORT, WS_SERVER_HOST };
