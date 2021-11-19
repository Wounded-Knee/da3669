import { action } from '../../all';

export const actionTypes = {
  ADD_ENTITY: 'ADD_ENTITY',
};

export const reducer = (state: any, { type, payload }: action): any => {
  switch (type) {
    case actionTypes.ADD_ENTITY:
      console.log('reduce add entity');
      return {
        ...state,
        entities: [...state.entities, payload],
      };
  }
  return state;
};
