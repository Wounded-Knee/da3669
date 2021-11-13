import React, { useState } from 'react';
import { Form } from './form';

export const Navigator = () => {
  const [entities, setEntities] = useState([]);

  const onSubmit = (...args) => console.log(args);

  return entities.length ? <Form entity={entities[0]} onSubmit={onSubmit} /> : 'No entities';
};
