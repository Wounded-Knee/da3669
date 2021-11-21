import { reducer } from './reducer';
import { getStore } from '../../../shared/lib/redux/store';
import { save } from '../persist';

export const store = getStore(reducer);

// Persistence on each change
store.subscribe(() => save(store.getState()));
