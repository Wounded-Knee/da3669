import sift from 'sift';
import { store } from '../../lib/redux/store';
import { id as idQuery, runProfile as runProfileQuery } from '../../../shared/lib/selectorQueries';

export const getDrawerState = (drawerName) => store.getState().ui.drawers[drawerName];
export const selectNodesByProfile = (profile) => store.getState().nodes.filter(sift(runProfileQuery(profile)));
