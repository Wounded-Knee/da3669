import { useState, useEffect } from 'react';
import { action, dispatch } from '../webSocket';
import { server } from '../../shared/lib/redux/actionTypes';
import { store } from './redux/store';
import { useOnMount } from './useOnMount';
import { getTopLevelNodes } from './redux/selectors';

export const useNodes = (nodeSelector) => {
  const [nodes, setNodes] = useState(nodeSelector.nodes);
  const [topLevelNodes, setTopLevelNodes] = useState(getTopLevelNodes());

  useOnMount(() => {
    action(server.SUBSCRIBE_BY_SELECTOR, 'TOP_LEVEL');
    return store.subscribe(() => {
      setTopLevelNodes(getTopLevelNodes());
    });
  });

  useEffect(() => {
    if (nodeSelector.ids.length) {
      dispatch(nodeSelector.serverAction);
      const storeUnsubscribe = store.subscribe(() => {
        setNodes(nodeSelector.nodes);
      });
      return () => {
        storeUnsubscribe();
        dispatch(nodeSelector.serverUnsubscribe);
      };
    }
  }, [JSON.stringify(nodeSelector.serialize)]);

  return {
    nodes,
    topLevelNodes,
  };
};
