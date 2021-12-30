import sift from 'sift';
import { store } from '../../lib/redux/store';
import { id as idQuery, getOperationByProfile } from '../../../shared/lib/selectorQueries';
import { addHelper, inspectSelectorProfile } from '../debug';
import { SelectorProfile, INodeAll } from '../../../shared/all';

export const getDrawerState = (drawerName: string): boolean => store.getState().ui.drawers[drawerName];
export const selectNodesByProfile = (profile: SelectorProfile): INodeAll[] => {
  const operation = getOperationByProfile(profile);
  if (typeof operation !== 'boolean') {
    if (operation.client) {
      const selection = operation.client(store.getState().nodes);
      console.log('selectNodesByProfile()', inspectSelectorProfile(profile), selection);
      return selection;
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
