import { headerText, appName, WS_SERVER_HOST, WS_SERVER_PORT, cookieName } from '../shared/config';
import { get } from './lib/LocalStorage';

const localState = get(appName) || { ui: { drawers: {} } };

export const WS_URL = `ws://${WS_SERVER_HOST}:${WS_SERVER_PORT}`;

export const initialState = {
  nodes: [],
  documents: [],
  user: {
    id: null,
  },
  ui: {
    ...localState.ui,
    drawers: {
      info: false,
      data: false,
      sideMenu: false,
      ...localState.ui.drawers,
    },
    ready: {
      webSocket: false,
    },
    docStore: {
      currentDoc: {},
    },
    selectedEntityIndex: null,
    selectedEntityHistory: [],
  },
};

export const clownTitle = true;

export { cookieName, appName, headerText, WS_SERVER_PORT, WS_SERVER_HOST };
