export const TYPE_RELATION = 'RELATION';
export const TYPE_CONTENT = 'CONTENT';

class Entity {
  data;
  core;

  constructor(data, core) {
    this.data = data;
    this.core = core;
  }

  get id() {
    return this.data.id;
  }

  get type() {
    return this.data.type;
  }
}

class RelationalEntity extends Entity {
  get entities() {
    return this.data.entities;
  }

  get relationshipType() {
    return this.data.relationshipType;
  }
}

class ContentEntity extends Entity {
  get relatives() {}

  relateTo(entityId, relationshipType) {}
}

const Entities = {
  [TYPE_CONTENT]: ContentEntity,
  [TYPE_RELATION]: RelationalEntity,
};

export class Core {
  dispatch;
  entities;
  userId;
  state;
  startDate;

  constructor({ uiState, wsState }) {
    const [state, stateDispatch] = uiState;
    this.ws = wsState;
    this.startDate = new Date();
    this.entities = state.entities;
    this.userId = state.user.id;
    this.state = state;
    this.dispatch = stateDispatch;
  }

  clobber() {
    this.dispatch({ type: 'CLOBBER_ENTITIES', payload: [] });
  }

  get ui() {
    const { ui } = this.state;
    return {
      closeDrawer: (drawerName) => this.dispatch({ type: 'DRAWER', payload: [drawerName, false] }),
      openDrawer: (drawerName) => this.dispatch({ type: 'DRAWER', payload: [drawerName, true] }),
      toggleDrawer: (drawerName) => this.dispatch({ type: 'DRAWER', payload: [drawerName, !ui.drawers[drawerName]] }),
      drawerState: (drawerName) => ui.drawers[drawerName],

      selectEntity: (entityId) => {
        this.ui.openDrawer('info');
        return this.dispatch({ type: 'SELECT_ENTITY', payload: entityId });
      },
      getSelectedEntity: () => {
        const selectedEntity = this.getById(ui.selectedEntityHistory[ui.selectedEntityIndex]);
        return selectedEntity;
      },
      getSelectedEntityHistory: () => ui.selectedEntityHistory.map((entityId) => this.getById(entityId)),
    };
  }

  /* Getters */
  get user() {
    return this.getById(this.userId);
  }

  getById(soughtId) {}

  /* Setters */
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  set user(userId) {
    this.userId = userId;
    this.dispatch({ type: 'SET_USERID', payload: userId });
  }

  createEntity(data) {}
}
