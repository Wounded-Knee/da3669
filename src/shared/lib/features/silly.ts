const rpc = ['beSilly'];

const server = async function (context, next) {
  const { request, args } = this;
  if (request === rpc[0]) {
    this.reply({ silly: args });
    console.log(this);
  }
  await next();
};

const client = undefined;

export { rpc, server, client };
