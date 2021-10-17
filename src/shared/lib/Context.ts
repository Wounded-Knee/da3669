class Context {
  request = {};
  payload = {};
  core = {};
  args = {};
  code = '';

  constructor(core, request, ...args) {
    this.request = request;
    this.args = args;
    this.core = core;
  }

  reply(obj) {
    Object.assign(this.payload, obj);
  }
}

export default Context;
