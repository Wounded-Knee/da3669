import { useSelector, useDispatch } from 'react-redux';
import { client } from '../../../shared/lib/redux/actionTypes';
import { addHelper } from '../../lib/debug';

export const useUIState = () => {
  const uiState = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const returnValue = {
    ...uiState,
    toggleDrawer: (drawerName) =>
      dispatch({ type: client.DRAWER, payload: [drawerName, !uiState.drawers[drawerName]] }),
    seeDrawer: (drawerName) => uiState.drawers[drawerName],
    openDrawer: (drawerName, state) => dispatch({ type: client.DRAWER, payload: [drawerName, state] }),
  };

  addHelper({
    uiState: returnValue,
  });
  return returnValue;
};
