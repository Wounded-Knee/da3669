/*
Event
  Entity
    Text
    Avatar
    Relation
      Judgment (Classif)
    Classifier
*/

import { QuestionAnswer } from '@material-ui/icons';

export const Entity = (text = 'Generic Entity') => ({
  id: 0,
  date: new Date().getTime(),
  type: 'Entity',
  relations: {
    mother: 0,
    creatress: 0,
    judgments: {},
  },
  data: {
    text,
  },
});

export const Text = (text) => ({
  ...Entity(),
  type: 'Text',
  data: {
    ...Entity().data,
    text,
  },
});

export const Classification = (name, description) => ({
  ...Entity(),
  type: 'Classification',
  data: {
    ...Entity().data,
    text: name,
    description,
  },
});

export const Avatar = (name) => ({
  ...Entity(),
  type: 'Avatar',
  data: {
    ...Entity().data,
    text: name,
  },
});

export const QuasiBoolean = (question, comment, ifyes, ifno, mother, motherQbool) => ({
  ...Entity(),
  type: 'QuasiBoolean',
  data: {
    ...Entity().data,
    text: question,
    comment,
    ifyes,
    ifno,
    motherQbool,
  },
  relations: {
    mother,
  },
});
