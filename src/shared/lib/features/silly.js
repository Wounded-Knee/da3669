module.exports = {
  rpc: ['beSilly'],
  server: async function ({ payload }, next) {
    this.reply({ silly: true });
    await next();
  },
  client: undefined,
};
