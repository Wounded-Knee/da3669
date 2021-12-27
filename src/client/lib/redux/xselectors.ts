import { id as idQuery } from '../../../shared/lib/selectorQueries';
import { store } from './store';
import sift from 'sift';

export const id = (id) => store.getState().nodes.filter(sift(idQuery(id)));
