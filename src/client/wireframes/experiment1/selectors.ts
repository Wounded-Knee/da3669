import { store } from '../../lib/redux/store';

export const getNodeById = (id) => store.getState().nodes.find(({ _id }) => _id === id);
