import { useReducer } from 'react';
import { initialState } from './initialState';
import { reducer } from './reducer';
import { dispatch } from '../../../shared/all';

export const useStateManager = (): [any, dispatch] => useReducer(reducer, initialState);
