import { useReducer, useCallback, useEffect } from 'react';
import { persist as persistAction } from '../wireframes/docstore/actions';
import { store } from './redux/store';
import { useDebounce } from './useDebounce';

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

const persist = async function (node) {
  console.log('Persisting ', node);
  return store.dispatch(persistAction(node));
};

export function useNode(nodeSeed) {
  const [state, dispatch] = useReducer(reducer, { ...defaultState, node: nodeSeed });
  const { node, saved } = state;
  const checksum = useDebounce(
    Object.keys(nodeSeed).reduce((checksum, pathName) => `${checksum}/${pathName}=${node[pathName]}`, ''),
    250,
  );

  const updatePath = (path, value) => {
    dispatch({ type: 'UPDATE_PATH', payload: { path, value } });
  };

  useEffect(() => {
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
  }, [checksum]);

  return [state, updatePath];
}
