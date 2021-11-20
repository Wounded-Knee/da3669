import { Core as SharedCore } from '../../shared/lib/Core';
import { action, ICoreConfig } from '../all';
import { actionTypes } from './redux/reducer';

import { Client } from 'rpc-websockets';
import { resolve } from 'path';

export class Core extends SharedCore {
  cfg: ICoreConfig;

  constructor(cfg: ICoreConfig) {
    super();
    this.cfg = cfg;

    const { host, port } = this.cfg;
    const url = `ws://${host}:${port}`;
    this.log(`Connecting to ${url}...`);
    const transport = new Client(url);
    transport.on('open', () => {
      this.log('Connected.');
    });
    this.transport = transport;
  }

  get user() {
    return this.state.user;
  }

  get ui() {
    return this.state.ui;
  }

  uiSetDrawer(drawerName, bool) {
    this.dispatch({ type: actionTypes.DRAWER, payload: bool });
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
