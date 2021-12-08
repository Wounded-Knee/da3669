import { useState, useEffect } from 'react';
import { action } from './webSocket';
import { server } from '../../../shared/lib/redux/actionTypes';
import { store } from '../../lib/redux/store';
import { useOnMount } from '../../lib/useOnMount';
import { getNodeById } from './selectors';

export const useNode = (id) => {
  const [node, setNode] = useState(getNodeById(id));

  useOnMount(() => {
    return store.subscribe(() => {
      setNode(getNodeById(id));
    });
  });

  useEffect(() => {
    !node && action(server.GET_NODE_BY_ID, id);
  }, [id]);

  return {
    node,
  };
};
