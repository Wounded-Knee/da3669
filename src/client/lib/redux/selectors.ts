import { store } from '../../lib/redux/store';

export const getDrawerState = (drawerName) => store.getState().ui.drawers[drawerName];
