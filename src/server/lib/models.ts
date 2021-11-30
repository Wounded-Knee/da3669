import transport from '../transport';

const filenames = ['nodeModel', 'documentModel', 'userModel'];
const defaultModelName = 'Node';
// @ts-ignore
const models = filenames.map((filename) => require(`./models/${filename}`).default);
const defaultModel = models.find(({ modelName }) => modelName === defaultModelName);
const getModelByNode = ({ kind }) => models.find(({ modelName }) => modelName === kind) || defaultModel;
const getModelByName = (soughtModelName) =>
  models.find(({ modelName }) => modelName === soughtModelName) || defaultModel;

// @ts-ignore
transport.register('persist', async ([node]) => {
  const { kind } = node;
  if (kind) {
    // @ts-ignore
    const { model } = getModelByNode(node);
    console.log(
      `Persist (as ${model.modelName})`,
      node,
      models.map(({ modelName }) => modelName),
      node.kind,
    );
    return await model.persist(node);
  } else {
    console.error('Node has no "kind"', node);
    return Promise.reject('No kind');
  }
});

transport.register('list', async () => {
  const { model } = defaultModel;
  return await model.find({});
});

transport.register('getById', async (_id) => {
  const { model } = defaultModel;
  return await model.findById(_id);
});

export default models;
