import { Schema, model } from 'mongoose';
import { nodeTypes as nodeTypeList } from '../config';

const addSchemaStatics = (schema, statics) => {
  if (statics) Object.keys(statics).forEach((staticName) => (schema.statics[staticName] = statics[staticName]));
};

const addRelationPaths = (modelName, schemaPaths, relationTypes = []) => ({
  ...schemaPaths,
  rel: {
    ...relationTypes.reduce(
      (schemaPaths, [[singular, pathName]]) => ({
        ...schemaPaths,
        [pathName]: { type: [Schema.Types.Mixed], ref: 'Message' },
      }),
      {},
    ),
  },
});

export const getNodeTypeByName = (soughtName) => nodeTypesMore.find(({ name }) => name === soughtName);

const IS_NODE = typeof global === 'object' && '[object global]' === global.toString.call(global);

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const nodeTypes = nodeTypeList.map((type) => require(`./${type}`).default);
export const nodeTypesMore = nodeTypes.map((nodeType) => {
  const {
    extending,
    options: protoOptions,
    schemaPaths: protoSchemaPaths,
    schemaStatics,
    name,
    relationTypes,
  } = nodeType;
  const souper = extending ? nodeTypes.find(({ name }) => name === extending) : undefined;
  const schemaPaths = extending
    ? addRelationPaths(name, { ...souper.schemaPaths, ...protoSchemaPaths }, relationTypes)
    : addRelationPaths(name, protoSchemaPaths, relationTypes);
  const options = extending
    ? {
        ...(souper.options || {}),
        ...protoOptions,
      }
    : protoOptions;
  const schema = new Schema(schemaPaths, { strict: false, ...options });
  addSchemaStatics(schema, schemaStatics);

  return {
    ...nodeType,
    schemaPaths,
    model: IS_NODE ? (extending ? model(souper.name).discriminator(name, schema) : model(name, schema)) : undefined,
    relationTypes,
    schema,
  };
});

export const defaultNodeType = nodeTypesMore.find((nodeType) => !!nodeType.default);

export const relationTypes = nodeTypes.reduce(
  (allRelationTypes, { relationTypes }) => [...allRelationTypes, ...(relationTypes || [])],
  [],
);

console.log(
  'Node Types Loaded: ',
  nodeTypesMore.map((nodeType) => {
    const { name, model, schemaPaths } = nodeType;
    return {
      name,
      model: !!model,
      schemaPaths: JSON.stringify(schemaPaths),
    };
  }),
  '\nRelation Types: ',
  relationTypes,
);
