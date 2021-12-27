import { Types, ObjectId } from 'mongoose';
import { Query } from 'sift';

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
