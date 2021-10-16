const silly = {
  rpc: ['beSilly'],
  server: async function ({ payload }, next) {
    this.reply({ silly: true });
    await next();
  },
  client: undefined,
};

export default silly;
