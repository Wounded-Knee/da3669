const models = ['documentModel'];

export default (core) => {
  const { transport } = core;

  models.forEach((modelName) => {
    const filename = `./models/${modelName}`;
    // @ts-ignore
    const { namespace, actions } = require(filename);
    Object.keys(actions).forEach((keyName) => {
      const actionName = `${namespace}.${keyName}`;
      console.log('Registering ', actionName);
      transport.register(actionName, actions[keyName]);
    });
  });

  return {};
};
