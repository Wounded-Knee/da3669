import { Core as SharedCore } from '../../shared/lib/Core';
import { set } from './LocalStorage';
import { appName } from '../config';
import { action, ICoreConfig } from '../all';
import { actionTypes } from './redux/reducer';
import transport from './transport';

export class Core extends SharedCore {
  cfg: ICoreConfig;

  constructor(cfg: ICoreConfig) {
    super();
    this.cfg = cfg;

    transport.on('open', () => {
      this.log('Connected.');
      this.dispatch({ type: actionTypes.READY_WEBSOCKET });
    });
    this.transport = transport;
    this.store.subscribe(() => {
      const { user, ui } = this.store.getState();
      set(appName, { ui, user });
    });
  }

  get user() {
    return this.state.user;
  }

  get ui() {
    return this.state.ui;
  }

  uiSetDrawer(drawerName, bool) {
    this.dispatch({ type: actionTypes.DRAWER, payload: [drawerName, bool] });
  }

  uiGetSelectedEntityHistory() {
    return this.state.ui.selectedEntityHistory;
  }

  createEntity(data) {
    return new Promise((resolve, reject) => {
      this.tx({ type: actionTypes.ADDED_ENTITY, payload: data })
        .then((action) => {
          resolve(this.dispatch(action));
        })
        .catch((...args) => this.log(...args));
    });
  }

  getEntityById(soughtId) {
    new Promise((resolve, reject) => {
      this.tx({ type: actionTypes.FETCH_ENTITY, payload: soughtId }).then((action) => {
        return this.dispatch(action);
      });
    });
    return super.getEntityById(soughtId);
  }

  tx(action: action): Promise<any> {
    return new Promise((resolve, reject) => {
      this.transport.call('dispatch', action).then(resolve).catch(reject);
    });
  }

  rx(action: action): Promise<any> {
    return new Promise((resolve) => {
      console.log('Received action ', action);
      this.dispatch(action);
      resolve(void 0);
    });
  }
}
