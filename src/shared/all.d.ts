export type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number;
export type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never;
export type FixedLengthArray<T extends any[]> = Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>> & {
  [Symbol.iterator]: () => IterableIterator<ArrayItems<T>>;
};
export type RelationshipArray = FixedLengthArray<[number, number]>;

// D3
export type action = { type: string; payload: any };
export type dispatch = (action) => any;

export interface IEntity {
  id: number;
  type: string;
  date: {
    created: Date;
    published: Date;
  };
}

interface IState {
  entities: [IEntity];
}

export type IServerState = IState;

export interface ICoreConfig {
  store: any;
  host: string;
  port: number;
  date: {
    [key: string]: Date;
  };
}
