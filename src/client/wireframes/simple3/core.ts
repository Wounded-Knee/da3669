export const TYPE_USER = 'USER';
export const TYPE_MESSAGE = 'MESSAGE';
export const TYPE_ANSWER = 'ANSWER';
export const TYPE_VOTE = 'VOTE';
export const TYPE_RELATIONAL = 'RELATIONAL';
export const REL = 'QA';

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
    return this.relationalEntities.reduce((relations, relationalEntity) => {
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

  relateTo({ id }, relationshipType) {
    this.core.createEntity(
      {
        entities: [this.id, id],
        relationshipType,
      },
      this.id,
      TYPE_RELATIONAL,
    );
  }
}

class RelationalEntity extends Entity {
  get entities() {
    return this.data.entities;
  }
}

class ContentEntity extends Entity {
  get relatives() {
    return new Relations(this, this.core);
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
  [TYPE_ANSWER]: AnswerEntity,
  [TYPE_MESSAGE]: MessageEntity,
  [TYPE_USER]: UserEntity,
  [TYPE_VOTE]: VoteEntity,
  [TYPE_RELATIONAL]: RelationalEntity,
};

export class Core {
  currentId = 0;
  data;
  userId;
  setData;
  setUser;

  constructor(data, setData, userId, setUser) {
    this.data = data;
    this.userId = userId;
    this.setData = setData;
    this.setUser = setUser;
    this.currentId = this.data.reduce((maxId, { id }) => Math.max(maxId, id) + 1, 0);
  }

  /* Getters */
  get user() {
    return this.getById(this.userId);
  }

  getNextId() {
    return this.currentId++;
  }

  getById(soughtId) {
    const data = this.data.find(({ id }) => id === soughtId);
    return data ? new Entities[data.type](data, this) : undefined;
  }

  getByType(soughtType) {
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
  }

  createEntity(data, mother, type) {
    this.setData([
      ...this.data,
      {
        id: this.getNextId(),
        mother: mother,
        type,
        creatress: this.userId,
        ...data,
      },
    ]);
  }
}
