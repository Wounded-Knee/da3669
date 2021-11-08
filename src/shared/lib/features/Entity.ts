const RPC_GET_ENTITY = 'getEntityById';
const RPC_ADD_ENTITY = 'addEntity';

const feature = {
  [RPC_ADD_ENTITY]: {
    args: [
      {
        name: 'entityData',
        type: 'json',
        pack: (data) => JSON.parse(data),
        unpack: (data) => JSON.stringify(data),
      },
    ],
    middleware: function () {
      const {
        core: { store },
        request,
        args,
      } = this;
      this.reply(store.addEntity(...args));
    },
  },
  [RPC_GET_ENTITY]: {
    args: [
      {
        name: 'entityId',
        type: 'number',
        validator: (num) => num < Infinity && num >= 0,
      },
    ],
    middleware: function () {
      const {
        core: { store },
        request,
        args,
      } = this;
      this.reply(store.getEntityById(...args));
    },
  },
};

export default feature;
