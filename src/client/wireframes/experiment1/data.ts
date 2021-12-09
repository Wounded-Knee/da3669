import { useReducer } from 'react';

export const data = [
  ...`ARTHUR: Old woman!

DENNIS: Man!

ARTHUR: Man. Sorry. What knight lives in that castle over there?

DENNIS: I'm thirty-seven.

ARTHUR: I-- what?

DENNIS: I'm thirty-seven. I'm not old.

ARTHUR: Well, I can't just call you 'Man'.

DENNIS: Well, you could say 'Dennis'.

ARTHUR: Well, I didn't know you were called 'Dennis'.

DENNIS: Well, you didn't bother to find out, did you?

ARTHUR: I did say 'sorry' about the 'old woman', but from the behind you looked--

DENNIS: What I object to is that you automatically treat me like an inferior!

ARTHUR: Well, I am King!

DENNIS: Oh, King, eh, very nice. And how d'you get that, eh? By exploiting the workers! By 'anging on to outdated imperialist dogma which perpetuates the economic and social differences in our society. If there's ever going to be any progress with the--

WOMAN: Dennis, there's some lovely filth down here. Oh! How d'you do?

ARTHUR: How do you do, good lady? I am Arthur, King of the Britons. Who's castle is that?

WOMAN: King of the who?

ARTHUR: The Britons.

WOMAN: Who are the Britons?

ARTHUR: Well, we all are. We are all Britons, and I am your king.

WOMAN: I didn't know we had a king. I thought we were an autonomous collective.

DENNIS: You're fooling yourself. We're living in a dictatorship: a self-perpetuating autocracy in which the working classes--

WOMAN: Oh, there you go bringing class into it again.

DENNIS: That's what it's all about. If only people would hear of--

ARTHUR: Please! Please, good people. I am in haste. Who lives in that castle?

WOMAN: No one lives there.

ARTHUR: Then who is your lord?

WOMAN: We don't have a lord.

ARTHUR: What?

DENNIS: I told you. We're an anarcho-syndicalist commune. We take it in turns to act as a sort of executive officer for the week,...

ARTHUR: Yes.

DENNIS: ...but all the decisions of that officer have to be ratified at a special bi-weekly meeting...

ARTHUR: Yes, I see.

DENNIS: ...by a simple majority in the case of purely internal affairs,...

ARTHUR: Be quiet!

DENNIS: ...but by a two-thirds majority in the case of more major--

ARTHUR: Be quiet! I order you to be quiet!

WOMAN: Order, eh? Who does he think he is? Heh.

ARTHUR: I am your king!

WOMAN: Well, I didn't vote for you.

ARTHUR: You don't vote for kings.

WOMAN: Well, how did you become King, then? `
    .split('\n\n')
    .map((line, index) => ({
      _id: `${index + 1000}`,
      upstreams: index > 0 ? [`${index + 1000 - 1}`] : [],
      text: line,
    })),

  {
    _id: '2000',
    upstreams: ['1000'],
    text: 'WOMAN: Yes?',
  },
];

export const getNodeById = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const subject = data.find(({ _id }) => _id === id) || {};
      const downstreams = data.filter(({ upstreams }) => upstreams.indexOf(id) !== -1);
      const upstreams = data.filter(({ _id }) => subject.upstreams && subject.upstreams.indexOf(_id) !== -1);
      const node = {
        ...subject,
        upstreams,
        downstreams,
      };
      resolve(node);
    }, 300);
  });

export const getTopLevelNodes = () =>
  new Promise((resolve, reject) => data.filter(({ upstreams }) => !!upstreams.length));

export const createNode = (nodeData) => {
  new Promise((resolve, reject) => {
    data.push({
      _id: '2000',
      upstreams: ['1000'],
      text: 'WOMAN: Yes?',
    });
  });
};
console.log(data);

const reducer = (state, action) => {
  return state;
};

export const useNodeDatabase = () => {
  const [state, dispatch] = useReducer(reducer, data);

  return {
    getNodeById: (id) => {
      const subject = state.find(({ _id }) => _id === id) || {};
      const downstreams = state.filter(({ upstreams }) => upstreams.indexOf(id) !== -1);
      const upstreams = state.filter(({ _id }) => subject.upstreams.indexOf(_id) !== -1);
      const node = {
        ...subject,
        upstreams,
        downstreams,
      };
      return node;
    },
  };
};
