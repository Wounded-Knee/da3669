import NodeModel from './models/NodeModel';
import { nodeTypes as sharedNodeTypes } from '../../shared/config';
const { extend } = NodeModel;

const nodeTypes = sharedNodeTypes.reduce((acc, nodeType) => {
  const definition = {
    ...nodeType,
    ...(nodeType.default
      ? NodeModel
      : extend({
          name: nodeType.name,
          schemaPaths: nodeType.schemaPaths,
        })),
  };
  return [...acc, definition];
}, []);

export const defaultNodeType = nodeTypes.find((nodeType) => nodeType.default === true);
export const getNodeTypeByNodeData = ({ kind }) => nodeTypes.find(({ name }) => name === kind) || defaultNodeType;
