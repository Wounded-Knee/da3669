import mongoose from 'mongoose';
import { useReducer, useEffect } from 'react';
import { useOnMount } from './useOnMount';
import { useDebounce } from './useDebounce';
import { getNodeTypeByName, defaultNodeType } from '../../shared/nodes/all';
import { useDispatch, useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { WS_SERVER_HOST, WS_SERVER_PORT } from '../config';
const WS_URL = `ws://${WS_SERVER_HOST}:${WS_SERVER_PORT}`;

const debugReducer = true;
const reducer = (state, action) => {
  try {
    const { type, payload } = action;
    if (debugReducer) console.log('useNode Reducer: ', type, payload);
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
          pendingRelations: [],
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
          loading: false,
          loaded: false,
          loads: {
            ...state.loads,
            error: [new Date(), ...state.loads.error],
          },
        };

      case 'BEGAN_LOAD':
        return {
          ...state,
          loaded: false,
          loading: true,
          loads: {
            ...state.loads,
            began: [new Date(), ...state.loads.began],
          },
        };

      case 'FINISHED_LOAD':
        return {
          ...state,
          loaded: true,
          loading: false,
          loads: {
            ...state.loads,
            finished: [new Date(), ...state.loads.finished],
          },
          node: payload,
        };

      case 'UPDATED_PATH':
        const { path, value } = payload;
        return {
          ...state,
          saved: false,
          node: {
            ...state.node,
            [path]: value,
          },
        };

      case 'ADDED_RELATION':
        return {
          ...state,
          saved: false,
          pendingRelations: [...state.pendingRelations, payload],
        };

      case 'QUEUED_RELATION':
        return {
          ...state,
          pendingRelations: [...state.pendingRelations, payload],
        };
    }
  } catch (e) {
    console.error(`Reducer Error ${e.message} on action `, action);
  }
  return state;
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
  pendingRelations: [],
  saved: true,
  loaded: false,
  loading: false,
  node: undefined,
};

export function useNode({ id, kind: propKind = defaultNodeType.name, relations = [] }) {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, { share: true });
  const reduxDispatch = useDispatch();
  const reduxNode = useSelector(({ nodes }) => nodes.find(({ _id }) => _id === id)) || {};
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    node: {
      _id: id,
      kind: propKind,
      ...reduxNode,
    },
  });
  const { node, saved, loaded, loading, pendingRelations } = state;
  const kind = node ? node.kind || propKind : propKind;

  const hash = useDebounce(
    //Object.keys(nodeSeed).reduce((checksum, pathName) => `${checksum}/${pathName}=${node[pathName]}`, '') +
    JSON.stringify(node) + JSON.stringify(pendingRelations),
    250,
  );

  const updatePath = (path, value) => {
    dispatch({ type: 'UPDATED_PATH', payload: { path, value } });
  };

  const addRelation = (type, nodeId) => {
    dispatch({ type: 'ADDED_RELATION', payload: { type, nodeId } });
  };

  useOnMount(() => {
    console.log('Mounted');
    relations.map(([type, nodeId]) => dispatch({ type: 'QUEUED_RELATION', payload: { type, nodeId } }));
  });

  useEffect(() => {
    if (lastJsonMessage) {
      const { type, payload } = lastJsonMessage;
      switch (type) {
        case 'GETNODEBYID':
          dispatch({ type: 'FINISHED_LOAD', payload });
          reduxDispatch({ type: 'NODE_REPLACE', payload });
          break;
        default:
          console.log('Message from the server: ', type, payload);
          break;
      }
    }
  }, [lastJsonMessage]);

  // Node load
  useEffect(() => {
    if (id && !loaded && !loading) {
      dispatch({ type: 'BEGAN_LOAD' });
      sendJsonMessage({ type: 'GETNODEBYID', payload: id });
    }
  }, [id]);

  // Node persist
  useEffect(() => {
    if (!saved) {
      const { schema } = getNodeTypeByName(kind);
      const validatorNode = new mongoose.Document(node, schema);
      validatorNode.validate((error) => {
        if (!error) {
          dispatch({ type: 'BEGAN_PERSIST', payload: undefined });
          persist(node)
            .then((node) =>
              pendingRelations.length
                ? new Promise((resolve, reject) => {
                    console.log(
                      'Dealing with ' + pendingRelations.length + ' new relationships and here they are ',
                      pendingRelations,
                    );
                    Promise.all(pendingRelations.map(({ type, nodeId }) => relate(type, node._id, nodeId))).then(() =>
                      resolve(node),
                    );
                  })
                : node,
            )
            .then((node) => {
              setTimeout(() => {
                // Why does this terminate flow? Ugly fix.
                reduxDispatch({ type: 'NODE_REPLACE', payload: node });
              }, 1);
              dispatch({ type: 'FINISHED_PERSIST', payload: node });
            })
            .catch(() => {
              dispatch({ type: 'ERROR_PERSIST', payload: undefined });
            });
        } else {
          console.error(error);
        }
      });
    }
  }, [hash]);

  return [state, { updatePath, addRelation }];
}
