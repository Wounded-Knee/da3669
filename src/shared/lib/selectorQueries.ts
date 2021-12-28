import { Types } from 'mongoose';
const { ObjectId } = Types;

export const id = (id) => ({ _id: new ObjectId(id) });

export const lacksRelation = (relationType) => ({
  $or: [
    { rel: { $exists: false } },
    { [`rel.${relationType}`]: { $exists: false } },
    { [`rel.${relationType}`]: { $size: 0 } },
  ],
});

export const hasRelation = (relationType) => ({
  $nor: [
    { rel: { $exists: false } },
    { [`rel.${relationType}`]: { $exists: false } },
    { [`rel.${relationType}`]: { $size: 0 } },
  ],
});

export const relationsOf = (id, ...relationTypes) => ({
  $or: relationTypes.map((relationType) => ({
    [`rel.${relationType}`]: { $in: [new ObjectId(id)] },
  })),
});

export const runProfile = (profile) => {
  const [methodName, ...args] = profile;
  switch (methodName) {
    case 'relationsOf':
      // @ts-ignore
      return relationsOf(...args);

    case 'hasRelation':
      // @ts-ignore
      return hasRelation(...args);

    case 'lacksRelation':
      // @ts-ignore
      return lacksRelation(...args);

    case 'id':
      // @ts-ignore
      return id(...args);
  }
};
