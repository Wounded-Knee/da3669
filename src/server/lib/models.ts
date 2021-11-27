import transport from '../transport';

const models = ['documentModel'];

models.forEach((modelName) => {
  const filename = `./models/${modelName}`;
  // @ts-ignore
  const { namespace, actions } = require(filename).default;
  Object.keys(actions).forEach((keyName) => {
    const actionName = `${namespace}.${keyName}`;
    console.log('Registering ', actionName);
    transport.register(actionName, async (...args) => {
      const args2 = args[0];
      //@ts-ignore
      return await actions[keyName](...args2)
        .then((rv) => {
          //@ts-ignore
          console.log(' Executing: ', keyName, ...args2, '\n', 'Returning: ', rv);
          return rv;
        })
        .catch((...err) => {
          //@ts-ignore
          console.error(' Executing: ', keyName, ...args2, '\n', 'Error: ', ...err);
        });
    });
  });
});

export default models;
