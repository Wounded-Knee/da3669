import transport from '../transport';

const filenames = ['nodeModel', 'documentModel'];
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
  const { model } = getModelByName('Node');
  return await model.find({});
});

transport.register('getById', async (node) => {
  console.log('getById', node);
});

export default models;

/*
models.forEach((modelName) => {
  const filename = `./models/${modelName}`;
  // @ts-ignore
  const { namespace, actions } = require(filename).default;
  Object.keys(actions).forEach((keyName) => {
    const actionName = `${namespace}.${keyName}`;
    console.log('Registering ', actionName);
    transport.register(actionName, async (...args) => {
      const args2 = args[0];
      const executionLog = `Executing: ${actionName}(${JSON.stringify(args2[0])})`;
      //@ts-ignore
      return await actions[keyName](...args2)
        .then((rv) => {
          //@ts-ignore
          console.log(`${executionLog} === ${rv}`);
          return rv;
        })
        .catch((...err) => {
          //@ts-ignore
          console.error(`${executionLog} => ${err}`);
        });
    });
  });
});

export default models;
*/
