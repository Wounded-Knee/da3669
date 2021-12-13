import { Schema, model } from 'mongoose';
import { nodeTypes as nodeTypeList } from '../config';

const addSchemaStatics = (schema, statics) => {
  if (statics) Object.keys(statics).forEach((staticName) => (schema.statics[staticName] = statics[staticName]));
};
export const getNodeTypeByName = (soughtName) => nodeTypesMore.find(({ name }) => name === soughtName);

const IS_NODE = typeof global === 'object' && '[object global]' === global.toString.call(global);

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const nodeTypes = nodeTypeList.map((type) => require(`./${type}`).default);
export const nodeTypesMore = nodeTypes.map((nodeType) => {
  let schema, Model;
  const { extending, options, schemaPaths, schemaStatics, name } = nodeType;
  if (extending) {
    const souper = nodeTypes.find(({ name }) => name === extending);
    const souperModel = model(souper.name);
    const extendedOptions = {
      ...(souper.options || {}),
      ...options,
    };
    schema = new Schema(schemaPaths, extendedOptions);
    addSchemaStatics(schema, schemaStatics);
    Model = IS_NODE ? souperModel.discriminator(name, schema) : undefined;
  } else {
    schema = new Schema(schemaPaths, options);
    addSchemaStatics(schema, schemaStatics);
    Model = IS_NODE ? model(name, schema) : undefined;
  }
  return {
    ...nodeType,
    model: Model,
    schema,
  };
});

export const defaultNodeType = nodeTypesMore.find((nodeType) => !!nodeType.default);

console.log(
  'Node Types Loaded: ',
  nodeTypesMore.map((nodeType) => {
    const { name } = nodeType;
    return {
      name,
      model: !!model,
    };
  }),
);
