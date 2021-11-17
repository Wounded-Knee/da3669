import { Server } from 'rpc-websockets';
import { Core as SharedCore } from '../../shared/lib/Core';
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
          transport.on('dispatch', (action: action) => {
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

  rx(action: action): Promise<any> {
    return new Promise((resolve) => {
      this.dispatch(action);
      setTimeout(() => {
        this.tx({ type: 'CURRENT_STATE', payload: this.state });
        console.log('New state ', this.state);
        resolve(void 0);
      }, 1000);
    });
  }

  tx(action: action): Promise<any> {
    return new Promise((resolve) => {
      this.log('Emit ', action);
      this.transport.emit('dispatch', action);
      resolve(void 0);
    });
  }
}
