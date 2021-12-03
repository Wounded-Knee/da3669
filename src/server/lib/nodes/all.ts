import { Schema, model } from 'mongoose';
import { nodeTypes as sharedNodeTypes, getNodeTypeByName as getSharedNodeTypeByName } from '../../../shared/nodes/all';

export const nodeTypes = sharedNodeTypes.map((nodeType) => {
  let schema, Model;
  const { extending, options, schemaPaths, name } = nodeType;
  if (extending) {
    const souper = getSharedNodeTypeByName(extending);
    const souperModel = model(souper.name);
    const extendedOptions = {
      ...(souper.options || {}),
      ...options,
    };
    schema = new Schema(schemaPaths, extendedOptions);
    Model = souperModel.discriminator(name, schema);
  } else {
    schema = new Schema(schemaPaths, options);
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
