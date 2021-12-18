import { useState, useEffect } from 'react';
import { dispatch } from '../webSocket';
import { store } from './redux/store';

export const useNodes = (nodeSelector) => {
  const [nodes, setNodes] = useState(nodeSelector.nodes);

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
  };
};
