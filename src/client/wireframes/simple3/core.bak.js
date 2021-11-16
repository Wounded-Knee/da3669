export const TYPE_USER = 'USER';
export const TYPE_MESSAGE = 'MESSAGE';
export const TYPE_ANSWER = 'ANSWER';
export const TYPE_VOTE = 'VOTE';
export const TYPE_RELATIONAL = 'RELATIONAL';
export const TYPE_GENERIC = 'GENERIC';
export const REL_TYPE_BRO = 'BRO';

class Relations {
  referenceEntity;
  core;

  constructor(referenceEntity, core) {
    this.referenceEntity = referenceEntity;
    this.core = core;
  }

  get relationalEntities() {
    return this.core.filter(
      ({ type, entities }) => type === TYPE_RELATIONAL && entities.indexOf(this.referenceEntity.id) > -1,
    );
  }

  get all() {
    return this.relationalToRelative(this.relationalEntities);
  }

  get length() {
    return this.all.length;
  }

  _filter(relationalFilter = () => true, entityFilter = () => true) {
    const relationalEntities = this.relationalEntities.filter(relationalFilter);
    console.log('re', relationalEntities);
    return this.relationalToRelative(relationalEntities).filter(entityFilter);
  }

  relationalToRelative(relationalEntities) {
    return relationalEntities.reduce((relations, relationalEntity) => {
      const { id, entities, type } = relationalEntity;
      const x = entities.reduce((entitiesReduction, id) => {
        if (id !== this.referenceEntity.id) {
          return [...entitiesReduction, this.core.getById(id)];
        }
        return entitiesReduction;
      }, []);
      return [...relations, ...x];
    }, []);
  }

  getRelationalEntitiesByRelationshipType(soughtRelationshipType) {
    return this.relationalEntities.filter(({ relationshipType }) => relationshipType === soughtRelationshipType);
  }

  byType(soughtRelationshipType) {
    // @ts-ignore
    return this._filter(({ relationshipType }) => relationshipType === soughtRelationshipType);
  }
}

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
  get motherId() {
    return this.data.mother;
  }
  get mother() {
    return this.core.getById(this.motherId);
  }
  get type() {
    return this.data.type;
  }
  get creatressId() {
    return this.data.creatress;
  }
  get creatress() {
    return this.core.getById(this.creatressId);
  }
  get children() {
    return this.core.getChildrenById(this.id);
  }
  get messages() {
    return this.children.filter(({ type }) => type === TYPE_MESSAGE);
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
  get relatives() {
    return new Relations(this, this.core);
  }

  relateTo(entityId, relationshipType) {
    this.core.createEntity(
      {
        entities: [this.id, entityId],
        relationshipType,
      },
      this.id,
      TYPE_RELATIONAL,
    );
  }

  get isSelected() {
    const selected = this.core.ui.getSelectedEntity();
    return selected ? selected.id === this.id : false;
  }
}

class UserEntity extends ContentEntity {
  get name() {
    return this.data.name;
  }
}

class VoteEntity extends ContentEntity {
  get answer() {
    return this.mother;
  }
  get voter() {
    return this.creatress;
  }
}

class MessageEntity extends ContentEntity {
  get text() {
    return this.data.text;
  }
  get answers() {
    return this.children.filter(({ type }) => type === TYPE_ANSWER);
  }

  /* Returns all answers to this message
   * which were contributed by this message's
   * creatress.
   */
  get answersByCreatress() {
    return this.answers.filter(({ creatress }) => creatress === this.creatressId);
  }

  /* Returns the first answer which was
   * voted by this message's creatress
   */
  get answerVotedByCreatress() {
    const answers = this.answers.filter((answer) => {
      const { votes } = answer;
      const creatressVotes = votes.filter(({ voter }) => {
        return voter ? voter.id === this.mother.creatressId : false;
      });
      return creatressVotes.length;
    });
    return answers !== undefined ? answers[0] : [];
  }

  answerText(text) {
    const ids = [this.core.getNextId(), this.core.getNextId()];

    this.core.setData([
      ...this.core.data,
      {
        id: ids[0],
        mother: this.id,
        type: TYPE_ANSWER,
        creatress: this.core.userId,
        text,
      },
      {
        id: ids[1],
        mother: ids[0],
        type: TYPE_VOTE,
        creatress: this.core.userId,
      },
    ]);
  }
}

class AnswerEntity extends ContentEntity {
  get text() {
    return this.data.text;
  }
  get votes() {
    return this.children.filter(({ type }) => type === TYPE_VOTE);
  }
  get message() {
    return this.mother;
  }

  vote() {
    this.core.setData([
      ...this.core.data,
      {
        id: this.core.getNextId(),
        mother: this.id,
        type: TYPE_VOTE,
        creatress: this.core.userId,
      },
    ]);
  }

  votedByUser(idOrEntity) {
    const { id } = this.core.getEntityByIdOrEntity(idOrEntity);
    return !!this.votes.find(({ creatress }) => creatress === id);
  }
}

const Entities = {
  [TYPE_GENERIC]: Entity,
  [TYPE_ANSWER]: AnswerEntity,
  [TYPE_MESSAGE]: MessageEntity,
  [TYPE_USER]: UserEntity,
  [TYPE_VOTE]: VoteEntity,
  [TYPE_RELATIONAL]: RelationalEntity,
};

export class Core {
  currentId = 0;
  dispatch;
  data;
  userId;
  state;
  startDate;

  constructor(stateManagement) {
    const [state, stateDispatch] = stateManagement;
    this.startDate = new Date();
    this.data = state.entities;
    this.userId = state.user.id;
    this.state = state;
    this.dispatch = stateDispatch;
    this.currentId = this.data.reduce((maxId, { id }) => Math.max(maxId, id) + 1, 0);
  }

  /* Getters */
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

  get user() {
    return this.getById(this.userId);
  }

  getNextId() {
    return this.currentId++;
  }

  getById(soughtId) {
    const data = this.data.find(({ id }) => id === soughtId);
    if (data) {
      if (!Entities[data.type]) {
        throw new Error(`Unrecognized entity type ${data.type} found. ${JSON.stringify(data)}`);
      }
      return data ? new Entities[data.type](data, this) : undefined;
    } else {
      console.warn(`Non-existent entity getById(id:${soughtId}) sought`);
      return undefined;
    }
  }

  getByType(soughtType) {
    const Class = Entities[soughtType] ? Entities[soughtType] : Entities[TYPE_GENERIC];
    if (Object.keys(Entities).indexOf(soughtType) < 0)
      console.warn(`No entity type ${soughtType} exists, reverting to generic`);
    const data = this.data.filter(({ type }) => type === soughtType);
    return data.map((bit) => new Entities[soughtType](bit, this));
  }

  filter(filter) {
    return this.data.filter(filter).map((bit) => new Entities[bit.type](bit, this));
  }

  getChildrenById(soughtId) {
    const data = this.data.filter(({ mother }) => mother === soughtId);
    return data.map((bit) => new Entities[bit.type](bit, this));
  }

  getMotherById(soughtId) {
    const { mother } = this.getById(soughtId);
    const data = this.data.filter(({ id }) => id === mother);
    return data.map((bit) => new Entities[bit.type](bit, this));
  }

  getEntityByIdOrEntity(idOrEntity) {
    if (typeof idOrEntity === 'number') return this.getEntityByIdOrEntity(idOrEntity);
    return idOrEntity;
  }

  /* Setters */
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  set user(userId) {
    this.userId = userId;
    this.dispatch({ type: 'SET_USERID', payload: userId });
  }

  createEntity(data, mother, type) {
    this.dispatch({
      type: 'ADD_ENTITY',
      payload: {
        ...data,
        id: this.getNextId(),
        mother: mother,
        type,
        creatress: this.userId,
      },
    });
  }
}
