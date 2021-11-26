import transport from './transport';

export default {
  document: {
    persist: (...args) => transport.call('document.persist', ...args),
    list: () => transport.call('document.list'),
  },
};
