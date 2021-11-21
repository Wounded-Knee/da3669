import React from 'react';
import { JSON } from '../JSON';
import { QuestionAnswer } from '@material-ui/icons';

export const Edit = () => {
  return <div>Entity Editor</div>;
};

export const View = ({ entity }) => {
  return <JSON data={entity.data} />;
};

export const icon = <QuestionAnswer />;
