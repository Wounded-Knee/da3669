import { ObjectId } from 'mongoose';
import { PipelineStage } from 'mongoose';
export type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number;
export type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never;
export type FixedLengthArray<T extends any[]> = Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>> & {
  [Symbol.iterator]: () => IterableIterator<ArrayItems<T>>;
};

export type action = { type: string; payload: any };
export type dispatch = (action) => any;
export type SelectorProfile = any[];
export type RelationType = string;

export type UserId = string;
export type SessionId = string;
export type PromiseId = string;
export type NodeId = string;

export interface IMongoQuery {
  [key: any]: any;
}

export interface IMongoOperation {
  client?: any;
  find?: IMongoQuery;
  aggregate?: PipelineStage[];
}

export interface INodeBase {
  _id: ObjectId;
  author: string;
  updatedAt: Date;
  createdAt: Date;
  __v: number;
  rel: {
    [key: string]: ObjectId[];
  };
}

export interface INodeAll extends INodeBase {
  text: string;
}

export interface ISession {
  id: SessionId;
  userId: UserId;
  date: Date;
}

// [singular, plural]
export interface IRelationTuple {
  length: 2;
  0: RelationType;
  1: RelationType;
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
