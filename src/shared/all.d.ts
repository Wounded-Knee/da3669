export type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number;
export type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never;
export type FixedLengthArray<T extends any[]> = Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>> & {
  [Symbol.iterator]: () => IterableIterator<ArrayItems<T>>;
};

// D3
export type action = { type: string; payload: any };
export type dispatch = (action) => any;

export type UserId = string;
export type SessionId = string;
export type PromiseId = string;
export type NodeId = string;

export interface ISession {
  id: SessionId;
  userId: UserId;
  date: Date;
}

export interface INodeSelectorSerialized {
  ids: NodeId[];
  self: boolean;
  rel: boolean | string[];
  pop: boolean;
}

// [singular, plural]
export interface IRelationTuple {
  length: 2;
  0: string;
  1: string;
}
// [literal, virtual]
export interface IRelationType {
  length: 2;
  0: IRelationTuple;
  1: IRelationTuple;
}
export interface INodeTypeDefinition {
  name: string;
  default?: boolean;
  relationTypes: IRelationType[];
}
