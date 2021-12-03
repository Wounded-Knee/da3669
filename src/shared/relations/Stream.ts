export default {
  name: 'stream',
  relations: [
    {
      name: 'upstream',
      path: 'downstreams',
      virtual: true,
    },
    {
      name: 'downstream',
      path: 'upstreams',
    },
  ],
};
