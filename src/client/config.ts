import { headerText, appName, WS_SERVER_HOST, WS_SERVER_PORT, cookieName } from '../shared/config';
import { get } from './lib/LocalStorage';

const localState = get(appName) || { ui: { drawers: {} } };

export const autoLogin = false;
export const WS_URL = `ws://${WS_SERVER_HOST}:${WS_SERVER_PORT}`;

export const initialState = {
  nodes: [],
  ui: {
    ...localState.ui,
    selectedNodeId: undefined,
    user: {
      netWorth: 0,
      experienceCfg: {},
    },
    drawers: {
      experience: false,
      info: false,
      data: false,
      sideMenu: false,
      ...localState.ui.drawers,
    },
  },
};

export { cookieName, appName, headerText, WS_SERVER_PORT, WS_SERVER_HOST };
