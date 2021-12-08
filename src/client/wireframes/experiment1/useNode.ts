import React, { useState, useEffect } from 'react';
import { action } from './webSocket';
import { server } from '../../../shared/lib/redux/actionTypes';
import { store } from '../../lib/redux/store';
import { useOnMount } from '../../lib/useOnMount';

export const useNode = (id) => {
  const [node, setNode] = useState();

  useOnMount(() => {
    return store.subscribe(() => {
      const state = store.getState();
      setNode(state.nodes.find(({ _id }) => _id === id));
    });
  });

  useEffect(() => {
    action(server.GET_NODE_BY_ID, id);
  }, [id]);

  return {
    node,
  };
};
