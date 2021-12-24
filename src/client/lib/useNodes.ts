import { useState, useEffect } from 'react';
import { INodeAll } from '../../shared/all';
import { server } from '../../shared/lib/redux/actionTypes';
import { dispatch } from '../webSocket';
import { NodeSelector } from './NodeSelector';
import { store } from './redux/store';

const debug = {
  changes: true,
};

interface IUseNodesReturn {
  nodes: INodeAll[];
}

export const useNodes = (nodeSelector: NodeSelector): IUseNodesReturn => {
  const [nodes, setNodes] = useState(nodeSelector.nodes);

  useEffect(() => {
    dispatch({
      type: server.SUBSCRIBE,
      payload: nodeSelector.serialize(),
    });
    const storeUnsubscribe = store.subscribe(() => {
      if (debug.changes)
        console.log('Store Changed', {
          Nodes: nodeSelector.nodes,
          Selector: nodeSelector.debug(),
        });
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
