import { relationTypes as relationTypeList } from '../config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const relationTypes = relationTypeList.map((type) => require(`./${type}`).default);

export const getRelationTypeByName = (soughtName) => relationTypes.find(({ name }) => name === soughtName);

export const getNonVirtualPaths = () =>
  relationTypes.reduce(
    (paths, { relations }) => [...paths, ...relations.filter(({ virtual }) => !virtual).map(({ path }) => path)],
    [],
  );

export const getNonVirtualPathsByName = (type) =>
  relationTypes.find(({ name }) => name === type).relations.find(({ virtual }) => !virtual).path;
