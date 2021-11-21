import { entityModules, defaultEntityModule } from '../../shared/config';
import { getEntityTypeByModuleName } from '../../shared/lib/classes/entities';

/**
 * Imports all entity type components,
 * and exports them.
 */

let defaultEntityType = '';

export const entityComponents = entityModules.reduce((entityComponents, moduleName) => {
  const entityType = getEntityTypeByModuleName(moduleName);
  const component = require(`./entities/${moduleName}`);
  defaultEntityType = defaultEntityModule === moduleName ? entityType : defaultEntityType;

  return {
    ...entityComponents,
    [entityType]: component,
  };
}, {});

export const getComponentByType = (type) => entityComponents[type] || entityComponents[defaultEntityType];
