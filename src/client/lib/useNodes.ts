import { useState, useEffect } from 'react';
import { INodeAll, SelectorProfile } from '../../shared/all';
import { server } from '../../shared/lib/redux/actionTypes';
import { dispatch } from '../webSocket';
import { store } from './redux/store';
import { selectNodesByProfile } from './redux/selectors';
import { inspectSelectorProfile } from './debug';
import { getOperationByProfile } from '../../shared/lib/selectorQueries';

const debug = {
  changes: true,
};

export const useNodes = (selectorProfile: SelectorProfile, note: string = ''): INodeAll[] => {
  const [nodes, setNodes] = useState(selectNodesByProfile(selectorProfile));

  useEffect(() => {
    if (selectorProfile.length) {
      dispatch({
        type: server.SUBSCRIBE,
        payload: selectorProfile,
      }).then((nodes) => {
        console.log(`${note} DB Response`, nodes);
      });
      const storeUnsubscribe = store.subscribe(() => {
        if (debug.changes)
          console.log(`${note} Store Changed`, {
            Nodes: selectNodesByProfile(selectorProfile),
            Profile: inspectSelectorProfile(selectorProfile),
            Operation: getOperationByProfile(selectorProfile),
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

  return nodes;
};
