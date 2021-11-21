import { entityModules, defaultEntityModule } from '../../config';

/**
 * Imports all entity type modules,
 * Exports a list of types and classes.
 */

let defaultEntityType = '';

export const { entityTypes, entityClasses, moduleNameToEntityType } = entityModules.reduce(
  ({ entityTypes, entityClasses, moduleNameToEntityType }, moduleName) => {
    const {
      default: { entityType, entityClass },
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    } = require(`./entities/${moduleName}`);
    // @ts-ignore
    defaultEntityType = defaultEntityModule === moduleName ? Object.values(entityType)[0] : defaultEntityType;

    return {
      moduleNameToEntityType: {
        ...moduleNameToEntityType,
        [moduleName]: Object.values(entityType)[0],
      },
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
    moduleNameToEntityType: {},
  },
);

export const getClassByType = (type) => entityClasses[type] || entityClasses[defaultEntityType];
export const getEntityTypeByModuleName = (moduleName) =>
  moduleNameToEntityType[moduleName] || moduleNameToEntityType[defaultEntityType];
