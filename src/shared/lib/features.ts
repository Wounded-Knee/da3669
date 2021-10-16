const featureList = ['silly'];

const { rpc, server, client, features } = featureList
  .map((featureName) => require(`./features/${featureName}`))
  .reduce(
    (exports, { rpc, client, server }) => ({
      rpc: [...(exports.rpc || []), ...rpc],
      server: [...(exports.server || []), server],
      client: [...(exports.client || []), client],
    }),
    { features: featureList },
  );

export { rpc, server, client, features };
