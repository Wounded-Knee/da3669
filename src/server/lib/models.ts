import transport from '../transport';

const models = ['documentModel'];

models.forEach((modelName) => {
  const filename = `./models/${modelName}`;
  // @ts-ignore
  const { namespace, actions } = require(filename).default;
  Object.keys(actions).forEach((keyName) => {
    const actionName = `${namespace}.${keyName}`;
    console.log('Registering ', actionName);
    transport.register(actionName, actions[keyName]);
  });
});

export default models;
