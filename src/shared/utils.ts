import { IUserDTO } from './IUserDTO';

export const getUserFullName = (user: IUserDTO): string => `${user.firstName} ${user.lastName}`;
export const ObjectFilter = (...args) => ObjectRummage('filter', ...args);
export const ObjectFind = (...args) => ObjectRummage('find', ...args);
export const ObjectRummage = (operator?, obj?, predicate?) => {
  const makeArray = (val) => (val instanceof Array ? val : [val]);
  //@ts-ignore
  return makeArray(Object.keys(obj)[operator]((key) => predicate(key, obj))).reduce(
    (accumulation, key) => ({
      ...accumulation,
      [key]: obj[key],
    }),
    {},
  );
};
