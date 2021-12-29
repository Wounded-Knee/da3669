import mongoose from 'mongoose';
import { IMongoQuery, RelationType, NodeId, SelectorProfile } from '../all';
const { ObjectId } = mongoose.Types;

export const id = (id: NodeId): IMongoQuery => ({ _id: new ObjectId(id) });

export const lacksRelation = (relationType: RelationType): IMongoQuery => ({
  $or: [
    { rel: { $exists: false } },
    { [`rel.${relationType}`]: { $exists: false } },
    { [`rel.${relationType}`]: { $size: 0 } },
  ],
});

export const hasRelation = (relationType: RelationType): IMongoQuery => ({
  $nor: [
    { rel: { $exists: false } },
    { [`rel.${relationType}`]: { $exists: false } },
    { [`rel.${relationType}`]: { $size: 0 } },
  ],
});

export const relationsOf = (id: NodeId, ...relationTypes: RelationType[]): IMongoQuery => ({});

export const asRelation = (id: NodeId, ...relationTypes: RelationType[]): IMongoQuery => ({
  $or: relationTypes.map((relationType) => ({
    [`rel.${relationType}`]: { $in: [new ObjectId(id)] },
  })),
});

interface IValidationObject {
  id?: NodeId[];
  relationType?: RelationType[];
}
export const getQueryByProfile = (profile: SelectorProfile): IMongoQuery | boolean => {
  const [methodName, ...args] = profile;
  const validate = (validationObject: IValidationObject): boolean => {
    return Object.keys(validationObject).reduce((verdict: boolean, key) => {
      return (
        verdict &&
        validationObject[key].reduce(
          (verdict: boolean, val) =>
            verdict &&
            {
              relationType: (val) => typeof val === 'string',
              id: (val) => mongoose.Types.ObjectId.isValid(val),
            }[key](val),
        )
      );
    }, true);
  };
  switch (methodName) {
    case 'relationsOf':
      const [relativeId, ...relationTypes] = args;
      return validate({
        id: [relativeId],
        relationType: relationTypes,
      })
        ? // @ts-ignore
          relationsOf(...args)
        : false;

    case 'hasRelation':
      return validate({
        relationType: args,
      })
        ? // @ts-ignore
          hasRelation(...args)
        : false;

    case 'lacksRelation':
      return validate({
        relationType: args,
      })
        ? // @ts-ignore
          lacksRelation(...args)
        : false;

    case 'id':
      return validate({
        id: args,
      })
        ? // @ts-ignore
          id(...args)
        : false;
  }
};
