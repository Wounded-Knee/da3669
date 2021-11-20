import Entity from './entities/Entity';
import Image from './entities/Image';
import YouTube from './entities/YouTube';

export const entityTypes = {
  ENTITY: 'ENTITY',
  USER: 'USER',
  MESSAGE: 'MESSAGE',
  IMAGE: 'IMAGE',
  YOUTUBE: 'YOUTUBE',
};

export const entityClasses = {
  [entityTypes.ENTITY]: Entity,
  [entityTypes.USER]: Entity,
  [entityTypes.MESSAGE]: Entity,
  [entityTypes.IMAGE]: Image,
  [entityTypes.YOUTUBE]: YouTube,
};

export { Entity, Image, YouTube };
