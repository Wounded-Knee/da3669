import { QuasiBoolean } from '../../shared/lib/Entities';

export default {
  routes: [{ menu: 'DA3000', route: 'simple3/0' }],
  entities: {
    simple2: [
      {
        ...QuasiBoolean(
          'Do you know who I am?',
          'Im not sure that you know me, so...',
          'Hi friend!',
          'Hello, stranger.',
          0,
          0,
        ),
        id: 69,
      },
    ],
  },
  displayProps: {
    mother: 1,
    question: 'Are you gay?',
    comment: 'This one is controversial',
    ifyes: 'Youre gay',
    ifno: 'Youre not gay',
  },
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
    {
      author: 'Bob Hope',
      messages: ['Bob Hope never dies.'],
    },
  ],
};
