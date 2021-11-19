import { Server } from 'rpc-websockets';
import { Core as SharedCore } from '../../shared/lib/Core';
import { actionTypes, addEntity } from './redux/reducer';
import { ICoreConfig, action } from '../all';

export class Core extends SharedCore {
  cfg: ICoreConfig;

  constructor(cfg: ICoreConfig) {
    super();
    this.cfg = cfg;
    const { host, port } = this.cfg;

    this.whileInitializing(
      new Promise((resolve) => {
        this.log('Initializing...');
        const transport = new Server({
          port,
          host,
        });
        transport.on('listening', () => {
          this.log(`Listening on port ${port}`);
          transport.event('dispatch');
          transport.register('dispatch', (action: action) => {
            try {
              return this.rx(action);
            } catch (e) {
              this.log('ERROR: ', e);
              return Promise.reject();
            }
          });
          resolve(void 0);
        });
        this.transport = transport;
      }),
    );
  }

  dispatchAction(action) {
    const { type, payload } = action;
    switch (type) {
      case actionTypes.ADD_ENTITY:
        return this.dispatch(addEntity(payload));
        break;
      default:
        this.log(`Unrecognized action ${type}`);
        break;
    }
    return Promise.reject();
  }

  rx(action: action): Promise<any> {
    return this.dispatchAction(action);
  }

  tx(action: action): Promise<any> {
    return new Promise((resolve) => {
      this.log('Emit ', action);
      this.transport.emit('dispatch', action);
      resolve(void 0);
    });
  }
}
