import { Schema, model } from 'mongoose';
import { nodeTypes as nodeTypeList } from '../config';

const addSchemaStatics = (schema, statics) => {
  if (statics) Object.keys(statics).forEach((staticName) => (schema.statics[staticName] = statics[staticName]));
};

const addRelationPaths = (modelName, schemaPaths, relationTypes = []) => ({
  ...schemaPaths,
  rel: {
    ...relationTypes.reduce(
      (schemaPaths, [[singular, pathName]]) => ({
        ...schemaPaths,
        [pathName]: { type: [Schema.Types.Mixed], ref: 'Message' },
      }),
      {},
    ),
  },
});

export const getNodeTypeByName = (soughtName) => nodeTypesMore.find(({ name }) => name === soughtName);

const IS_NODE = typeof global === 'object' && '[object global]' === global.toString.call(global);

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const nodeTypes = nodeTypeList.map((type) => require(`./${type}`).default);
export const nodeTypesMore = nodeTypes.map((nodeType) => {
  const {
    extending,
    options: protoOptions,
    schemaPaths: protoSchemaPaths,
    schemaStatics,
    name,
    relationTypes,
  } = nodeType;
  const souper = extending ? nodeTypes.find(({ name }) => name === extending) : undefined;
  const schemaPaths = extending
    ? addRelationPaths(name, { ...souper.schemaPaths, ...protoSchemaPaths }, relationTypes)
    : addRelationPaths(name, protoSchemaPaths, relationTypes);
  const options = extending
    ? {
        ...(souper.options || {}),
        ...protoOptions,
      }
    : protoOptions;
  const schema = new Schema(schemaPaths, { strict: false, ...options });
  addSchemaStatics(schema, schemaStatics);

  return {
    ...nodeType,
    schemaPaths,
    model: IS_NODE ? (extending ? model(souper.name).discriminator(name, schema) : model(name, schema)) : undefined,
    relationTypes,
    schema,
  };
});

export const defaultNodeType = nodeTypesMore.find((nodeType) => !!nodeType.default);

export const relationTypes = nodeTypes.reduce(
  (allRelationTypes, { relationTypes }) => [...allRelationTypes, ...(relationTypes || [])],
  [],
);

export const RelationTypes = (...args) => new RelationType(...args);

class RelationType {
  group = [];
  currentSelector = '';
  lit = [0, 1];
  vir = [2, 3];
  sin = [0, 2];
  plu = [1, 3];

  constructor(selector = undefined) {
    if (typeof selector === 'string') {
      this.currentSelector = selector;
    } else if (selector !== 'undefined') {
    }
  }

  set selector(relationTypeName) {
    this.currentSelector = relationTypeName;
  }

  get selector() {
    return this.currentSelector;
  }

  get isLiteral() {
    return this.lit.includes(this.getCursorPosition());
  }

  get isVirtual() {
    return this.vir.includes(this.getCursorPosition());
  }

  get isSingular() {
    return this.sin.includes(this.getCursorPosition());
  }

  get isPlural() {
    return this.plu.includes(this.getCursorPosition());
  }

  get converse() {
    return this.isVirtual ? this.literal : this.virtual;
  }

  get virtual() {
    const tupleIndex = 1;
    return {
      singular: this.getGroup()[tupleIndex][0],
      plural: this.getGroup()[tupleIndex][1],
    };
  }

  get literal() {
    const tupleIndex = 0;
    return {
      singular: this.getGroup()[tupleIndex][0],
      plural: this.getGroup()[tupleIndex][1],
    };
  }

  getCursorPosition(selector = this.currentSelector, group = this.getGroup()) {
    return group.flat(1).indexOf(selector);
  }

  getGroup(selector = this.currentSelector) {
    const group = relationTypes.find((group) => group.find((tuple) => tuple.includes(this.currentSelector)).length > 0);
    return group.length ? group : false;
  }
}

console.log(
  'Node Types Loaded: ',
  nodeTypesMore.map((nodeType) => {
    const { name, model, schemaPaths } = nodeType;
    return {
      name,
      model: !!model,
      schemaPaths: JSON.stringify(schemaPaths),
    };
  }),
  '\nRelation Types: ',
  relationTypes,
);
