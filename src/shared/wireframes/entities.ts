import { RelationshipArray } from '../all';
import { Entity, RelationshipEntity, SequentialRelationshipEntity, RELATIONSHIP_TYPE } from './EntityTypes';

class Store {
  entities = [];
  events = [];
  relationshipClass = {
    [RELATIONSHIP_TYPE.GENERIC]: RelationshipEntity,
    [RELATIONSHIP_TYPE.SEQUENTIAL]: SequentialRelationshipEntity,
  };

  getEntityById(id) {
    return this.entities.find((entity) => entity.id === id);
  }

  add(entity) {
    this.entities.push(entity);
    return entity;
  }

  relate(relationshipType, ...entities) {
    const rClass = this.relationshipClass[relationshipType];
    // @ts-ignore
    const entityArray: RelationshipArray = entities.map(({ id }: { id: number }) => id);
    return this.add(new rClass(entityArray));
  }

  reduce(action) {
    console.log('Will reduce ', action);
  }
}

class Act {
  userId = 0;

  constructor(userId = 0) {
    this.userId = userId;
  }

  createEntity(payload) {
    return {
      ...this.abstractAction(payload),
      type: 'entity.create',
    };
  }

  relateEntity(relationshipType, toEntity, fromEntity) {
    return {
      ...this.abstractAction({}),
    };
  }

  abstractAction(payload) {
    return {
      type: 'abstract',
      date: new Date(),
      payload,
    };
  }
}

const systemActions = new Act(0);
const store = new Store();

const hello = store.add(new Entity('Hello'));
const world = store.add(new Entity('World'));
const relation = store.relate(RELATIONSHIP_TYPE.SEQUENTIAL, hello, world);
store.relate(RELATIONSHIP_TYPE.GENERIC, hello, world, relation);

export { store };
