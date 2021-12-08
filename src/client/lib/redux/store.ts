import { reducer } from './reducer';
import { getStore } from '../../../shared/lib/redux/store';

export const store = getStore(reducer);

window.store = store;
