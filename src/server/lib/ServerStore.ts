import Kernel from '../../shared/lib/Kernel';
import fs from 'fs';

class ServerStore extends Kernel {
  file = '';
  entityId = 0;
  entities = [];
  initialized = false;

  whileInitializing(...args) {
    return super.log(...args);
  }

  log(...args) {
    return super.log(...args);
  }

  constructor({ db }) {
    super();
    this.file = db;
    this.whileInitializing(this.firstLoad());
  }

  firstLoad() {
    return new Promise((resolve, reject) => {
      this.loadDB()
        .then(() => {
          this.initialized = true;
          resolve(void 0);
        })
        .catch((err) => {
          this.log(err);
        });
    });
  }

  getEntityById(userId, entityId) {
    const entity = this.entities.find(({ id }) => id === entityId);
    return entity;
  }

  addEntity(userId, entity) {
    return new Promise((resolve, reject) => {
      const newEntity = {
        ...entity,
        userId,
        date: {
          created: new Date(),
        },
        id: this.getNewEntityId(),
      };
      this.entities.push(newEntity);
      this.saveDB().then(() => resolve(newEntity));
    });
  }

  getNewEntityId() {
    return this.entityId + 1;
  }

  loadDB() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.file, 'utf8', (err, data) => {
        if (err) {
          this.log('Cant read file');
          reject();
        } else {
          try {
            this.entities = JSON.parse(data);
            this.entityId = this.entities.reduce(
              (highestId, entity) => (parseInt(entity.id) > highestId ? parseInt(entity.id) : highestId),
              this.entityId,
            );
            this.log(`Loaded ${this.entities.length} entities.`);
            resolve(void 0);
          } catch (e) {
            reject();
          }
        }
      });
    });
  }

  saveDB() {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.file, JSON.stringify(this.entities), 'utf8', (err) => {
        if (err) {
          this.log('Cant write file');
          reject();
        } else {
          resolve(void 0);
        }
      });
    });
  }
}
Object.assign(ServerStore.prototype, {
  _className: 'ServerStore',
  _showDebug: true,
});

export default ServerStore;
