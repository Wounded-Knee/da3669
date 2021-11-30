import { useReducer, useCallback, useEffect } from 'react';
import { persist as persistAction } from './actions';
import { store } from '../../lib/redux/store';
import { debounce } from 'debounce';

const reducer = (state, action) => {
  try {
    const { type, payload } = action;
    switch (type) {
      case 'ERROR_PERSIST':
        return {
          ...state,
          persists: {
            ...state.persists,
            error: [new Date(), ...state.persists.error],
          },
        };

      case 'BEGAN_PERSIST':
        return {
          ...state,
          persists: {
            ...state.persists,
            began: [new Date(), ...state.persists.began],
          },
        };

      case 'FINISHED_PERSIST':
        const { _id, createdAt, updatedAt, __v } = payload;
        return {
          ...state,
          saved: true,
          persists: {
            ...state.persists,
            finished: [new Date(), ...state.persists.finished],
          },
          node: {
            ...state.node,
            _id,
            createdAt,
            updatedAt,
            __v,
          },
        };

      case 'UPDATE_PATH':
        const { path, value } = payload;
        return {
          ...state,
          saved: false,
          node: {
            ...state.node,
            [path]: value,
          },
        };
    }
  } catch (e) {
    console.error(`Reducer Error ${e.message} on action `, action);
    return state;
  }
};

const defaultState = {
  persists: {
    began: [],
    finished: [],
    error: [],
  },
  saved: true,
  node: undefined,
};

const persist = async (node) => {
  console.log('Persisting ', node);
  return store.dispatch(persistAction(node));
};

export function useNode(nodeSeed) {
  const [state, dispatch] = useReducer(reducer, { ...defaultState, node: nodeSeed });
  const { node, saved, persists } = state;
  const checksum = Object.keys(nodeSeed).reduce(
    (checksum, pathName) => `${checksum}/${pathName}=${node[pathName]}`,
    '',
  );

  const updatePath = (path, value) => {
    dispatch({ type: 'UPDATE_PATH', payload: { path, value } });
  };

  //persist(node);
  /*
  const onChange = useCallback(
    debounce(() => {
      const persistInProgress = persists.began > persists.finished.length + persists.error.length;
      const doPersist = !saved && !persistInProgress;
      if (doPersist) {
        if (!persistInProgress) {
          console.log('Persisting Editor Changes as ', node);
          dispatch({ type: 'BEGAN_PERSIST', payload: undefined });
          persist(node)
            .then((node) => {
              dispatch({ type: 'FINISHED_PERSIST', payload: node });
            })
            .catch(() => {
              dispatch({ type: 'ERROR_PERSIST', payload: undefined });
            });
        } else {
          console.log('Persist already in progress... ', persists);
        }
      } else {
        console.log('Not persisting', doPersist, saved, persistInProgress);
      }
    }, 250),
    [state.saved],
  );
*/
  useEffect(
    useCallback(() => {
      console.log(checksum);
      if (!saved) {
        dispatch({ type: 'BEGAN_PERSIST', payload: undefined });
        persist(node)
          .then((node) => {
            dispatch({ type: 'FINISHED_PERSIST', payload: node });
          })
          .catch(() => {
            dispatch({ type: 'ERROR_PERSIST', payload: undefined });
          });
      }
    }, [checksum]),
    [saved],
  );

  return [state, updatePath];
}
