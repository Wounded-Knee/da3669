import { Server } from 'rpc-websockets';
import mongoose from 'mongoose';
import { Core as SharedCore } from '../../shared/lib/Core';
import { actionTypes, addEntity, fetchEntity } from './redux/reducer';
import { ICoreConfig, action } from '../all';
import Document from './models/documentModel';

export class Core extends SharedCore {
  cfg: ICoreConfig;

  constructor(cfg: ICoreConfig) {
    super();
    this.cfg = cfg;
    const {
      host,
      port,
      mongoDB: { url: mongoDBURL, sslCert },
    } = this.cfg;

    this.whileInitializing(
      new Promise((resolve) => {
        this.log('Initializing...');
        // MongoDB
        mongoose.connect(mongoDBURL).catch((err) => {
          if (err.toString().indexOf('certificate validation failed') !== -1) {
            this.log('MongoDB Certificate Validation Failed');
          } else {
            this.log(err);
          }
        });

        // Web Socket Server
        const transport = new Server({
          port,
          host,
        });
        transport.on('listening', () => {
          this.log(`Listening on port ${port}`);
          transport.event('dispatch');
          transport.register('execute', this.execute.bind(this));
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

  execute(action) {
    const { type, payload } = action;
    return new Promise((resolve, reject) => {
      this.log('Executing action ', action);
      try {
        new Document(payload)
          .save()
          .then((newDoc) => {
            console.log('Mongo returned ', newDoc);
            resolve({ type: actionTypes.DOCSTORE_UPDATE, payload: newDoc });
          })
          .catch((err) => this.error('MongoDB error ', err));
      } catch (e) {
        this.error('Error at Core.ts:execute() ', e);
      }
    });
  }

  dispatchAction(action) {
    const { type, payload } = action;
    switch (type) {
      case actionTypes.FETCH_ENTITY:
        return this.dispatch(fetchEntity(payload));
      case actionTypes.ADDED_ENTITY:
        return this.dispatch(addEntity(payload));
      default:
        this.log(`Unrecognized action ${type}`);
        return Promise.reject();
    }
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
