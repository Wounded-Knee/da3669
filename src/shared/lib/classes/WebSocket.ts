import Kernel from './Kernel';

class WebSocket extends Kernel {
  host;
  port;

  constructor({ host, port, methods }: { host: string; port: number; methods: string[] }) {
    super();
    this.host = host;
    this.port = port;
  }
}
Object.assign(Kernel.prototype, {
  _className: 'WebSocket',
  _showDebug: true,
});

export default WebSocket;
