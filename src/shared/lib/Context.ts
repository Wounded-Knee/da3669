class Context {
  request = {};
  payload = {};
  store = {};

  constructor(request, callback) {
    this.request = request;
  }

  reply(obj) {
    Object.assign(this.payload, obj);
  }
}

export default Context;
