import Feature from '../Feature';

const RPC_BE_SILLY = 'beSilly';

class Silly extends Feature {
  rpc = { [RPC_BE_SILLY]: {} };
  server = async function (context, next) {
    const { request, args } = this;
    if (request === RPC_BE_SILLY) {
      this.reply({ silly: args });
      console.log(this);
    }
    await next();
  };
}

export default Silly;
