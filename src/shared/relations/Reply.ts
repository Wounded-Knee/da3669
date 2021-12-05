export default {
  name: 'reply',
  relations: [
    {
      name: 'parent',
      path: 'replies',
      virtual: true,
    },
    {
      name: 'reply',
      path: 'parents',
    },
  ],
};
