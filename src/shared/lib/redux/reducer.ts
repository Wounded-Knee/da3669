import { action } from '../../all';

export const actionTypes = {
  ADDED_ENTITY: 'ADDED_ENTITY',
  FETCH_ENTITY: 'FETCH_ENTITY',
};

export const reducer = (state: any, { type, payload }: action): any => {
  switch (type) {
    default:
      return state;
  }
};
