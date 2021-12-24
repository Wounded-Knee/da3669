import mongoose, { Schema, model, Model } from 'mongoose';
import { nodeTypes as nodeTypeNames } from '../../../shared/config';
import { relationTypes } from '../../../shared/lib/RelationType';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeDefinitions = nodeTypeNames.map((nodeTypeName) => require(`./${nodeTypeName}`).default);

const getNodeDefinitionByName = (nodeTypeName) => nodeDefinitions.find(({ name }) => name === nodeTypeName);

const { name: defaultNodeDefinitionName } = nodeDefinitions.find((definition) => definition && definition.default);

const addRelationTypesToSchemaPaths = (schemaPaths, relationTypes) => ({
  ...schemaPaths,
  rel: {
    ...relationTypes.reduce(
      (rel, relationTypeGroup) => ({
        ...rel,
        ...relationTypeGroup.reduce(
          (rel, relationTypeTuple) => ({
            ...rel,
            [relationTypeTuple[1]]: [mongoose.Types.ObjectId],
          }),
          {},
        ),
      }),
      {},
    ),
  },
});

export const getModelByName = (modelName: string): Model<any> => {
  // Find the model and return it
  const extantModel = mongoose.modelNames().includes(modelName) && model(modelName);
  if (extantModel) return extantModel;

  // Create the model and return it
  const definition = getNodeDefinitionByName(modelName);
  if (!definition) throw new Error('Model not found: ' + modelName);
  const { extending, schemaPaths, options, relationTypes = [] } = definition;
  if (extending) {
    const { options: superOptions } = getNodeDefinitionByName(extending);
    const superModel = getModelByName(extending);
    const { relationTypes: superRelationTypes } = getNodeDefinitionByName(extending);
    return superModel.discriminator(
      modelName,
      new Schema(
        addRelationTypesToSchemaPaths(addRelationTypesToSchemaPaths(schemaPaths, relationTypes), superRelationTypes),
        {
          ...superOptions,
          ...options,
        },
      ),
    );
  } else {
    return model(modelName, new Schema(addRelationTypesToSchemaPaths(schemaPaths, relationTypes), options));
  }
};

export const defaultModel = getModelByName(defaultNodeDefinitionName);
