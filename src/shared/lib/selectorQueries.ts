import mongoose from 'mongoose';
import { IMongoOperation, RelationType, NodeId, SelectorProfile } from '../all';
const { ObjectId } = mongoose.Types;

export const id = (id: NodeId): IMongoOperation => ({ find: { _id: new ObjectId(id) } });

export const lacksRelation = (relationType: RelationType): IMongoOperation => ({
  find: {
    $or: [
      { rel: { $exists: false } },
      { [`rel.${relationType}`]: { $exists: false } },
      { [`rel.${relationType}`]: { $size: 0 } },
    ],
  },
});

export const hasRelation = (relationType: RelationType): IMongoOperation => ({
  find: {
    $nor: [
      { rel: { $exists: false } },
      { [`rel.${relationType}`]: { $exists: false } },
      { [`rel.${relationType}`]: { $size: 0 } },
    ],
  },
});

// For now, this DB aggregation only supports the first relationType given in the array...
export const relationsOf = (id: NodeId, ...relationTypes: RelationType[]): IMongoOperation => ({
  client: (nodes) => {
    const baseNode = nodes.find(({ _id }) => _id.equals(id));
    if (baseNode && baseNode.rel) {
      let relations = [];
      relationTypes.forEach((relationType) => {
        const idStrings = (baseNode.rel[relationType] || []).map((idObject) => idObject.toString());
        relations = [...relations, ...idStrings];
      });
      if (relations.length) console.log('Relations ', relationTypes, relations);
      const rv = nodes.filter((node) => relations.includes(node._id.toString()));
      return rv;
    } else {
      return [];
    }
  },
  aggregate: [
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $project: {
        [`rel.${relationTypes[0]}`]: true,
      },
    },
    {
      $lookup: {
        from: 'bases',
        let: {
          relativeIds: `$rel.${relationTypes[0]}`,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$relativeIds'],
              },
            },
          },
        ],
        as: 'relatives',
      },
    },
    {
      $project: {
        relatives: true,
      },
    },
  ],
});

export const asRelation = (id: NodeId, ...relationTypes: RelationType[]): IMongoOperation => ({
  find: {
    $or: relationTypes.map((relationType) => ({
      [`rel.${relationType}`]: { $in: [new ObjectId(id)] },
    })),
  },
});

interface IValidationObject {
  id?: NodeId[];
  relationType?: RelationType[];
}
export const getOperationByProfile = (profile: SelectorProfile): IMongoOperation | boolean => {
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
