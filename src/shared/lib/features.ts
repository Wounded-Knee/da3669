const featureList = ['silly'];

const { rpc, server, client, features } = featureList
  .map((featureName) => require(`./features/${featureName}`))
  .reduce(
    ({ rpc: prevRpc, server: prevServer, client: prevClient }, { rpc, client, server }) => ({
      features: featureList,
      rpc: [...prevRpc, ...rpc],
      server: [...prevServer, server],
      client: [...prevClient, client],
    }),
    {
      rpc: [],
      server: [],
      client: [],
    },
  );

export { rpc, server, client, features };
