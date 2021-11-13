import { useState } from 'react';
import { Core } from './core';
import { data as staticData } from './data';

describe('Core', () => {
  it('works', () => {
    let data = staticData;
    let user = '';
    const setData = (newData) => (data = newData);
    const setUser = (newData) => (user = newData);

    const core = new Core(data, setData, user, setUser);
    const entity = core.getById(1);

    const testData = [
      entity.type,
      entity.text,
      entity.children.length,
      entity.answers.length,
      entity.answers.votes.length,
    ];

    expect(testData).toMatchSnapshot();
  });
});
