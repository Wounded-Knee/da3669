import mongoose, { Schema, model, Model } from 'mongoose';
import { nodeTypes as nodeTypeNames } from '../../../shared/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeDefinitions = nodeTypeNames.map((nodeTypeName) => require(`./${nodeTypeName}`).default);

const getNodeDefinitionByName = (nodeTypeName) => nodeDefinitions.find(({ name }) => name === nodeTypeName);

const { name: defaultNodeDefinitionName } = nodeDefinitions.find((definition) => definition && definition.default);

export const getModelByName = (modelName: string): Model<any> => {
  // Find the model and return it
  const extantModel = mongoose.modelNames().includes(modelName) && model(modelName);
  if (extantModel) return extantModel;

  // Create the model and return it
  const definition = getNodeDefinitionByName(modelName);
  if (!definition) throw new Error('Model not found: ' + modelName);
  const { extending, schemaPaths, options } = definition;
  if (extending) {
    const { options: superOptions } = getNodeDefinitionByName(extending);
    const superModel = getModelByName(extending);
    return superModel.discriminator(
      modelName,
      new Schema(schemaPaths, {
        ...superOptions,
        ...options,
      }),
    );
  } else {
    return model(modelName, new Schema(schemaPaths, options));
  }
};

export const defaultModel = getModelByName(defaultNodeDefinitionName);
