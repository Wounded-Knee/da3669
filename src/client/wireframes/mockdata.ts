export default {
  routes: [
    { menu: 'Votes', route: 'votes' },
    { menu: 'Rubric', route: 'rubric' },
    { menu: 'Screen 1', route: 'screen1' },
    { menu: 'Chat', route: 'chat' },
  ],
  classifications: [
    {
      values: ['Not Racist', 'N/A', 'Racist'],
    },
  ],
  chat: [
    {
      author: 'Bob Hope',
      messages: ['I am Bob Hope!'],
    },
    {
      author: 'Erin Blakeley',
      messages: ['I doubt that.', 'Bob Hope is dead.', 'And all of my dreams with him.'],
    },
  ],
};
