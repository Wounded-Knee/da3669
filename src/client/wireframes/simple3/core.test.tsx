import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { App } from '../../App';
import { TYPE_GENERIC } from './core';

const shallow = new ShallowRenderer();

let core;
let component;
const setCore = (thisIsCore) => (core = thisIsCore);
beforeEach(() => {
  const component = shallow.render(<App setCore={setCore} />);
  core.dispatch({ type: 'CLOBBER_ENTITIES', payload: [] });
});

describe('Core', () => {
  it('exists', () => {
    expect(core.data).toBeDefined();
  });

  it('can create an entity', () => {
    expect(core.data.length).toBe(0);
    core.createEntity({}, undefined, TYPE_GENERIC);
    expect(core.data.length).toBe(1);
  });

  it('can relate entities', () => {
    core.createEntity({}, undefined, TYPE_GENERIC);
    core.createEntity({}, undefined, TYPE_GENERIC);
  });
});
