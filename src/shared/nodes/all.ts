import { nodeTypes as nodeTypeList } from '../config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const nodeTypes = nodeTypeList.map((type) => require(`./${type}`).default);
export const defaultNodeType = nodeTypes.find((nodeType) => !!nodeType.default);
export const getNodeTypeByName = (soughtName) => nodeTypes.find(({ name }) => name === soughtName);
