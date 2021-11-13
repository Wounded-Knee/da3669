export const TYPE_RELATIONAL = 'RELATIONAL';
export const TYPE_USER = 'USER';
export const TYPE_MESSAGE = 'MESSAGE';
export const TYPE_ANSWER = 'ANSWER';
export const TYPE_VOTE = 'VOTE';

const users = [
  {
    id: 100,
    type: TYPE_USER,
    name: 'Ringo',
  },
  {
    id: 101,
    type: TYPE_USER,
    name: 'Paul',
  },
  {
    id: 102,
    type: TYPE_USER,
    name: 'John',
  },
  {
    id: 103,
    type: TYPE_USER,
    name: 'George',
  },
];

const relations = [
  {
    id: 300,
    type: TYPE_RELATIONAL,
    creatress: 100,
    entities: [103, 100],
  },
  {
    id: 301,
    type: TYPE_RELATIONAL,
    creatress: 100,
    entities: [103, 101],
  },
  {
    id: 302,
    type: TYPE_RELATIONAL,
    creatress: 100,
    entities: [103, 102],
  },
];

const messagesMontyPython = [
  {
    id: 0,
    type: TYPE_MESSAGE,
    creatress: 100,
    text: 'What is the airspeed velocity of an unladen swallow?',
  },
  {
    id: 1,
    type: TYPE_MESSAGE,
    creatress: 101,
    mother: 0,
    text: 'African or European?',
  },
  {
    id: 6,
    type: TYPE_ANSWER,
    creatress: 100,
    mother: 1,
    text: 'Both!',
  },
  {
    id: 2,
    type: TYPE_ANSWER,
    creatress: 100,
    mother: 1,
    text: 'African',
  },
  {
    id: 3,
    type: TYPE_ANSWER,
    creatress: 100,
    mother: 1,
    text: 'European',
  },
  {
    id: 4,
    type: TYPE_MESSAGE,
    creatress: 103,
    mother: 2,
    text: '42 mph',
  },
  {
    id: 5,
    type: TYPE_MESSAGE,
    creatress: 103,
    mother: 2,
    text: '31 mph',
  },
];

const messageGeneral = [
  {
    id: 20,
    type: TYPE_MESSAGE,
    creatress: 100,
    text: 'Where are you from?',
  },
  {
    id: 21,
    mother: 20,
    type: TYPE_MESSAGE,
    creatress: 101,
    text: 'Austin, TX',
  },
];

const messages = [...messagesMontyPython, ...messageGeneral];

const votes = [
  {
    id: 200,
    creatress: 100,
    type: TYPE_VOTE,
    mother: 2,
  },
];

export const data = [...users, ...messages, ...votes, ...relations];
