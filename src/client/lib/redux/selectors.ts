import sift from 'sift';
import { store } from '../../lib/redux/store';
import { id as idQuery, getOperationByProfile } from '../../../shared/lib/selectorQueries';
import { addHelper } from '../debug';
import { SelectorProfile, INodeAll } from '../../../shared/all';

export const getDrawerState = (drawerName: string): boolean => store.getState().ui.drawers[drawerName];
export const selectNodesByProfile = (profile: SelectorProfile): INodeAll[] => {
  const operation = getOperationByProfile(profile);
  if (typeof operation !== 'boolean') {
    if (operation.client) {
      return operation.client(store.getState().nodes);
    } else if (operation.find) {
      return store.getState().nodes.filter(sift(operation.find));
    } else if (operation.aggregate) {
      console.error("Can't do client-side aggregations, yet.");
    }
  }
  return [];
};

addHelper({
  selectors: { getDrawerState, selectNodesByProfile },
});
