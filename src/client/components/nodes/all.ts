import { nodeTypes as sharedNodeTypes } from '../../../shared/config';
import Base from './Base';
import Document from './Document';
import Message from './Message';
import User from './User';

const componentData = {
  [sharedNodeTypes[0]]: Base,
  [sharedNodeTypes[1]]: Document,
  [sharedNodeTypes[2]]: User,
  [sharedNodeTypes[3]]: Message,
};

const nodeTypes = sharedNodeTypes.reduce((acc, nodeTypeName) => {
  const filename = `./${nodeTypeName}`;
  const definition = {
    name: nodeTypeName,
    filename,
    ...componentData[nodeTypeName],
  };
  return [...acc, definition];
}, []);

export const defaultNodeType = nodeTypes.find((nodeType) => nodeType.default === true);
export const getNodeTypeByNodeData = ({ kind }) => getComponentByType(kind);
export const getComponentByType = (type) => {
  const x = nodeTypes.find(({ name }) => name === type);
  const y = x || defaultNodeType;
  const z = y.Component;
  return z;
};
