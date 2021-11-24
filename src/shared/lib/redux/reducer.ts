import { action } from '../../all';

export const actionTypes = {
  ADDED_ENTITY: 'ADDED_ENTITY',
  FETCH_ENTITY: 'FETCH_ENTITY',
  DOCSTORE_UPDATE: 'DOCSTORE_UPDATE',
  DOCSTORE_GET_DOC_BY_ID: 'DOCSTORE_GET_DOC_BY_ID',
};

export const reducer = (state: any, { type, payload }: action): any => {
  switch (type) {
    default:
      return state;
  }
};
