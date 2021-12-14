import { useState, useEffect } from 'react';
import { action, dispatch } from '../webSocket';
import { server } from '../../shared/lib/redux/actionTypes';
import { store } from './redux/store';
import { useOnMount } from './useOnMount';
import { selectNodes, getTopLevelNodes } from './redux/selectors';

export const useNodes = (nodeIdArray = []) => {
  const nodeSelector = selectNodes(...nodeIdArray);
  const [nodes, setNodes] = useState(nodeSelector.nodes);
  const [topLevelNodes, setTopLevelNodes] = useState(getTopLevelNodes());

  useOnMount(() => {
    action(server.SUBSCRIBE_BY_SELECTOR, 'TOP_LEVEL');
    return store.subscribe(() => {
      setTopLevelNodes(getTopLevelNodes());
    });
  });

  useEffect(() => {
    if (nodeIdArray.length) {
      dispatch(nodeSelector.serverAction);
      return store.subscribe(() => {
        setNodes(nodeSelector.nodes);
      });
    }
  }, [JSON.stringify(nodeIdArray)]);

  return {
    nodes,
    topLevelNodes,
  };
};
