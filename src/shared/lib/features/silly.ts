const rpc = ['beSilly'];
const server = async function ({ payload }, next) {
  this.reply({ silly: true });
  await next();
};
const client = undefined;

export { rpc, server, client };
