import { useState, useEffect } from 'react';
import { server } from '../../shared/lib/redux/actionTypes';
import { dispatch } from '../webSocket';
import { store } from './redux/store';

export const useNodes = (nodeSelector) => {
  const [nodes, setNodes] = useState(nodeSelector.nodes);

  useEffect(() => {
    dispatch({
      type: server.SUBSCRIBE,
      payload: nodeSelector.serialize(),
    });
    const storeUnsubscribe = store.subscribe(() => {
      setNodes(nodeSelector.nodes);
    });
    return () => {
      storeUnsubscribe();
      dispatch({
        type: server.UNSUBSCRIBE,
        payload: nodeSelector.serialize(),
      });
    };
  }, [JSON.stringify(nodeSelector.serialize())]);

  return {
    nodes,
  };
};
