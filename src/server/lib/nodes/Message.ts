export default {
  name: 'Message',
  extending: 'Base',
  schemaPaths: {
    text: { type: String, required: true },
  },
};
