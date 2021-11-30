import { useReducer, useCallback, useEffect } from 'react';
import { persist as persistAction, getNodeById as getNodeByIdAction } from '../wireframes/docstore/actions';
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

      case 'ERROR_LOAD':
        return {
          ...state,
          loads: {
            ...state.loads,
            error: [new Date(), ...state.loads.error],
          },
        };

      case 'BEGAN_LOAD':
        console.log(type);
        return {
          ...state,
          loaded: false,
          loads: {
            ...state.loads,
            began: [new Date(), ...state.loads.began],
          },
        };

      case 'FINISHED_LOAD':
        return {
          ...state,
          loaded: true,
          loads: {
            ...state.loads,
            finished: [new Date(), ...state.loads.finished],
          },
          node: payload,
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
  loads: {
    began: [],
    finished: [],
    error: [],
  },
  saved: true,
  loaded: false,
  node: undefined,
};

const persist = async function (node) {
  return store.dispatch(persistAction(node));
};

const getNodeById = async function (_id) {
  return store.dispatch(getNodeByIdAction(_id));
};

export function useNode(nodeSeed) {
  const [state, dispatch] = useReducer(reducer, { ...defaultState, node: nodeSeed });
  const { node, saved, loaded } = state;
  const { _id } = node;
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

  useEffect(() => {
    if (_id && !loaded) {
      dispatch({ type: 'BEGAN_LOAD' });
      getNodeById(_id)
        .then((node) => {
          dispatch({ type: 'FINISHED_LOAD', payload: node });
        })
        .catch(() => {
          dispatch({ type: 'ERROR_LOAD' });
        });
    }
  }, [_id]);

  return [state, updatePath];
}
