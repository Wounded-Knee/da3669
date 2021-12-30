import { useState, useEffect } from 'react';
import { INodeAll, SelectorProfile } from '../../shared/all';
import { server } from '../../shared/lib/redux/actionTypes';
import { dispatch } from '../webSocket';
import { store } from './redux/store';
import { selectNodesByProfile } from './redux/selectors';
import { inspectSelectorProfile } from './debug';

const debug = {
  changes: true,
};

interface IUseNodesReturn {
  nodes: INodeAll[];
}

export const useNodes = (selectorProfile: SelectorProfile): IUseNodesReturn => {
  const [nodes, setNodes] = useState(selectNodesByProfile(selectorProfile));

  useEffect(() => {
    if (selectorProfile.length) {
      dispatch({
        type: server.SUBSCRIBE,
        payload: selectorProfile,
      });
      const storeUnsubscribe = store.subscribe(() => {
        if (debug.changes)
          console.log('Store Changed', {
            Nodes: selectNodesByProfile(selectorProfile),
            Profile: inspectSelectorProfile(selectorProfile),
          });
        setNodes(selectNodesByProfile(selectorProfile));
      });

      return () => {
        storeUnsubscribe();
        dispatch({
          type: server.UNSUBSCRIBE,
          payload: selectorProfile,
        });
      };
    }
  }, [selectorProfile.join('/')]);

  return {
    nodes,
  };
};
