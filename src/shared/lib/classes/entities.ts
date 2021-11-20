import Entity from './entities/Entity';

export const entityTypes = {
  ENTITY: 'ENTITY',
  USER: 'USER',
  MESSAGE: 'MESSAGE',
};

export const entityClasses = {
  [entityTypes.ENTITY]: Entity,
  [entityTypes.USER]: Entity,
  [entityTypes.MESSAGE]: Entity,
};

export { Entity };
