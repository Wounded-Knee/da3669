import { useState, useEffect } from 'react';
import { action } from '../webSocket';
import { server } from '../../shared/lib/redux/actionTypes';
import { store } from './redux/store';
import { useOnMount } from './useOnMount';
import { getNodesById, getTopLevelNodes } from './redux/selectors';

export const useNodes = (nodeIdArray = []) => {
  const [nodes, setNodes] = useState(getNodesById(nodeIdArray));
  const [topLevelNodes, setTopLevelNodes] = useState(getTopLevelNodes());

  useOnMount(() => {
    action(server.SUBSCRIBE_BY_SELECTOR, 'TOP_LEVEL');
    return store.subscribe(() => {
      setTopLevelNodes(getTopLevelNodes());
    });
  });

  useEffect(() => {
    if (nodeIdArray.length) {
      action(server.SUBSCRIBE, nodeIdArray);
      return store.subscribe(() => {
        setNodes(getNodesById(nodeIdArray));
      });
    }
  }, [JSON.stringify(nodeIdArray)]);

  return {
    nodes,
    topLevelNodes,
  };
};
