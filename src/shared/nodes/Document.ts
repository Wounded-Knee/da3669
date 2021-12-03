export default {
  name: 'Document',
  extending: 'Base',
  schemaPaths: {
    checkbox: Boolean,
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
};
