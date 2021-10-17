const RPC_GET_ENTITY = 'getEntityById';
const RPC_ADD_ENTITY = 'addEntity';
const rpc = [RPC_ADD_ENTITY, RPC_GET_ENTITY];

const server = async function (context, next) {
  const { core, request, args } = this;
  switch (request) {
    case RPC_GET_ENTITY:
      this.reply(core.getEntityById(...args));
      break;
    case RPC_ADD_ENTITY:
      this.reply(core.addEntity(...args));
      break;
  }
  await next();
};

const client = undefined;

export { rpc, server, client };
