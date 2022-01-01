export const responseBundler = async (context, next) => {
  context.response = {
    promiseId: context.message.decoded.promiseId,
    actions: context.actions,
  };
  await next();
};
