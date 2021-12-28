import sift from 'sift';
import { store } from '../../lib/redux/store';
import { id as idQuery, getQueryByProfile } from '../../../shared/lib/selectorQueries';
import { addHelper } from '../debug';
import { SelectorProfile, INodeAll } from '../../../shared/all';

export const getDrawerState = (drawerName: string): boolean => store.getState().ui.drawers[drawerName];
export const selectNodesByProfile = (profile: SelectorProfile): INodeAll[] =>
  store.getState().nodes.filter(sift(getQueryByProfile(profile)));

addHelper({
  selectors: { getDrawerState, selectNodesByProfile },
});
