import { entityModules, defaultEntityModule } from '../../config';

/**
 * Imports all entity type modules,
 * Exports a list of types and classes.
 */

let defaultEntityType = '';

export const { entityTypes, entityClasses } = entityModules.reduce(
  ({ entityTypes, entityClasses }, moduleName) => {
    const {
      default: { entityType, entityClass },
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    } = require(`./entities/${moduleName}`);
    // @ts-ignore
    defaultEntityType = defaultEntityModule === moduleName ? Object.values(entityType)[0] : defaultEntityType;

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

export const getClassByType = (type) => entityClasses[type] || entityClasses[defaultEntityType];
