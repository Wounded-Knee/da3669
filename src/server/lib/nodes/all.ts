import { Schema, model } from 'mongoose';
import { nodeTypes as sharedNodeTypes, getNodeTypeByName as getSharedNodeTypeByName } from '../../../shared/nodes/all';

const addSchemaStatics = (schema, statics) => {
  if (statics) Object.keys(statics).forEach((staticName) => (schema.statics[staticName] = statics[staticName]));
};

export const nodeTypes = sharedNodeTypes.map((nodeType) => {
  let schema, Model;
  const { extending, options, schemaPaths, schemaStatics, name } = nodeType;
  if (extending) {
    const souper = getSharedNodeTypeByName(extending);
    const souperModel = model(souper.name);
    const extendedOptions = {
      ...(souper.options || {}),
      ...options,
    };
    schema = new Schema(schemaPaths, extendedOptions);
    addSchemaStatics(schema, schemaStatics);
    Model = souperModel.discriminator(name, schema);
  } else {
    schema = new Schema(schemaPaths, options);
    addSchemaStatics(schema, schemaStatics);
    Model = model(name, schema);
  }
  return {
    ...nodeType,
    model: Model,
    schema,
  };
});

export const defaultNodeType = nodeTypes.find((nodeType) => !!nodeType.default);
export const getNodeTypeByName = (soughtName) => nodeTypes.find(({ name }) => name === soughtName);
