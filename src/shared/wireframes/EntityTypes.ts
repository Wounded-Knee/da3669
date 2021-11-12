import { RelationshipArray } from '../all';

let id: number = 0;

const ENTITY_TYPE = {
  ENTITY: 'Entity',
  RELATIONSHIP: 'Relationship',
};

const RELATIONSHIP_TYPE = {
  GENERIC: 'Generic',
  SEQUENTIAL: 'Sequential',
};

class Entity {
  id: number;
  type: string = ENTITY_TYPE.ENTITY;
  data: any;

  constructor(data?) {
    this.id = id++;
    this.data = data;
  }
}

class RelationshipEntity extends Entity {
  type: string = ENTITY_TYPE.RELATIONSHIP;
  relationshipType: string = RELATIONSHIP_TYPE.GENERIC;
  data: RelationshipArray;

  constructor(data: RelationshipArray) {
    super(data);
  }
}

class SequentialRelationshipEntity extends RelationshipEntity {
  relationshipType: string = RELATIONSHIP_TYPE.SEQUENTIAL;
}

export { Entity, RelationshipEntity, SequentialRelationshipEntity, ENTITY_TYPE, RELATIONSHIP_TYPE };
