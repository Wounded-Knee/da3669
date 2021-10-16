class Context {
  request = {};
  payload = {};
  core = {};

  constructor(core, request) {
    this.request = request;
    this.core = core;
  }

  reply(obj) {
    Object.assign(this.payload, obj);
  }
}

export default Context;
