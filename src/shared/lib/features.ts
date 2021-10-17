import { FEATURES } from '../config';

const { rpc, server, client, features } = FEATURES.map((featureName) => require(`./features/${featureName}`)).reduce(
  ({ rpc: prevRpc, server: prevServer, client: prevClient }, { rpc, client, server }) => ({
    features: FEATURES,
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
