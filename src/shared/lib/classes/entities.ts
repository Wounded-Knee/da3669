/**
 * Imports all entity type modules,
 * Exports a list of types and classes.
 */

const defaultEntityType = 'ENTITY';

export const { entityTypes, entityClasses } = ['Entity', 'Image', 'Relationship', 'YouTube'].reduce(
  ({ entityTypes, entityClasses }, moduleName) => {
    const {
      default: { entityType, entityClass },
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    } = require(`./entities/${moduleName}`);
    return {
      entityTypes: {
        ...entityTypes,
        ...entityType,
      },
      entityClasses: {
        ...entityClasses,
        ...entityClass,
      },
    };
  },
  {
    entityTypes: {},
    entityClasses: {},
  },
);

export const getClassByType = (type) => (type ? entityClasses[type] : entityClasses[defaultEntityType]);
