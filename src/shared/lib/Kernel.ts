import Class from './Class';

class Kernel extends Class {
  _initPromises = [];
  log(...args) {
    // @ts-ignore
    return super.log(...args);
  }

  initialize() {
    return Promise.all(this._initPromises || []);
  }

  whileInitializing(waitForThis) {
    this._initPromises = [...(this._initPromises || []), waitForThis];
  }
}
Object.assign(Kernel.prototype, {
  _className: 'Kernel',
  _showDebug: false,
});

export default Kernel;
