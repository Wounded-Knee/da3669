import { nodeTypes as sharedNodeTypes } from '../../../shared/config';
const fileContents = {
  Node: require('./Node').default,
  Document: require('./Document').default,
  Message: require('./Message').default,
};

const nodeTypes = sharedNodeTypes.reduce((acc, nodeType) => {
  const filename = `./${nodeType.name}`;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const contents = fileContents[nodeType.name];
  const definition = {
    ...nodeType,
    filename,
    ...contents,
  };
  return [...acc, definition];
}, []);

export const defaultNodeType = nodeTypes.find((nodeType) => nodeType.default === true);
export const getNodeTypeByNodeData = ({ kind }) => getComponentByType(kind);
export const getComponentByType = (type) => (nodeTypes.find(({ name }) => name === type) || defaultNodeType).Component;
