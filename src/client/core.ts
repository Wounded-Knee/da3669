import { Core } from './lib/Core';
import { store } from './lib/redux/store';
import { WS_SERVER_HOST, WS_SERVER_PORT } from './config';

export const core = new Core({
  host: WS_SERVER_HOST,
  port: WS_SERVER_PORT,
  store,
  date: {
    uiLoad: new Date(),
    uiRender: new Date(),
  },
});
window.core = core;
