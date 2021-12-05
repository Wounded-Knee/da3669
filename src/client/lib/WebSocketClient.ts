import Kernel from '../../../dist/shared/lib/classes/Kernel';

export class WebSocketClient extends Kernel {
  url;
  wsc;
  readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
  events = {
    onClose = (cb) => {},
    onError = (cb) => {},
    onOpen = (cb) => {},
    onMessage = (cb) => {},
  };

  constructor({
    url = window.location.host,
    onClose = (cb) => {},
    onError = (cb) => {},
    onOpen = (cb) => {},
    onMessage = (cb) => {},
  }) {
    super();
    this.url = url;
    this.events.onClose = onClose || (cb) => {};
    this.events.onError = onError || (cb) => {};
    this.events.onOpen = onOpen || (cb) => {};
    this.events.onMessage = onMessage || (cb) => {};

    this.whileInitializing(
      new Promise((resolve, reject) => {
        this.wsc = new WebSocket(url);
        this.wsc.onopen((...args) => resolve(this.onOpen(...args)));
        this.wsc.onclose((...args) => this.onClose(...args));
        this.wsc.onerror((...args) => this.onError(...args));
        this.wsc.onmessage((...args) => this.onMessage(...args));
        this.wsc.onclose((...args) => this.onClose(...args));
      }),
    );
  }

  onClose(event) {}

  onError(event) {}

  onMessage(event) {}

  onOpen(event) {}

  send(data) {
    return this.wsc.send(JSON.stringify(data));
  }

  get readyState() {
    return this.wsc.readyState;
  }

  get readyStateText() {
    return this.readyStates[this.readyState];
  }
}
