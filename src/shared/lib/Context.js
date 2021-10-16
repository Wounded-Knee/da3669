class Context {
  constructor(request, callback) {
    this.request = request;
    this.payload = {};
    this.store = store;
  }

  reply(obj) {
    Object.assign(this.payload, obj);
  }
}

export default Context;
