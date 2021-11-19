import { action } from '../../all';

export const actionTypes = {
  ADDED_ENTITY: 'ADDED_ENTITY',
};

export const reducer = (state: any, { type, payload }: action): any => {
  switch (type) {
    case actionTypes.ADDED_ENTITY:
      return {
        ...state,
        entities: [...state.entities, payload],
      };
  }
  return state;
};
