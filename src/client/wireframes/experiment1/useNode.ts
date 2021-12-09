import { useState, useEffect } from 'react';
import { action } from './webSocket';
import { server } from '../../../shared/lib/redux/actionTypes';
import { store } from '../../lib/redux/store';
import { useOnMount } from '../../lib/useOnMount';
import { getNodeById, getTopLevelNodes } from './selectors';

export const useNode = (id) => {
  const [node, setNode] = useState(getNodeById(id));
  const [topLevelNodes, setTopLevelNodes] = useState([]);

  useOnMount(() => {
    action(server.GET_TOP_LEVEL_NODES, undefined);
    return store.subscribe(() => {
      setNode(getNodeById(id));
      setTopLevelNodes(getTopLevelNodes());
    });
  });

  const createNode = (data) => {
    action(server.ABSORB_NODE, data);
  };

  useEffect(() => {
    !node && id && action(server.GET_NODE_BY_ID, id);
  }, [id]);

  return {
    node,
    topLevelNodes,
    createNode,
  };
};
