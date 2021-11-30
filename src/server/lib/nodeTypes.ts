import { nodeTypes as sharedNodeTypes } from '../../shared/config';

const nodeTypes = sharedNodeTypes.reduce((acc, nodeType) => {
  const filename = `./models/${nodeType.name}Model`;
  const definition = {
    ...nodeType,
    filename,
    // @ts-ignore
    ...require(filename).default,
  };
  return [...acc, definition];
}, []);

export const defaultNodeType = nodeTypes.find((nodeType) => nodeType.default === true);
export const getNodeTypeByNodeData = ({ kind }) => nodeTypes.find(({ name }) => name === kind) || defaultNodeType;
