import Kernel from '../../shared/lib/Kernel';

class Server extends Kernel {
  express;

  log(...args) {
    return super.log(...args);
  }

  initialize(...args) {
    // @ts-ignore
    return super.initialize(...args);
  }

  whileInitializing(...args) {
    // @ts-ignore
    return super.whileInitializing(...args);
  }
}

export default Server;
