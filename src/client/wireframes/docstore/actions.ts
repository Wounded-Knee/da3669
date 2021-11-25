export interface ITypedAction<TAction, TPayload> {
  type: TAction;
  payload: TPayload;
}

export type TypeA = 'EXAMPLE_A';
export type TypeB = 'EXAMPLE_B';

export interface IPayloadA {
  p1: string;
  p2: number;
}

export interface IPayloadB {
  p1: number;
}

export type ActionA = ITypedAction<TypeA, IPayloadA>;
export type ActionB = ITypedAction<TypeB, IPayloadB>;

export type Actions = ActionA | ActionB;

export type ActionCreatorA = (p1: string, p2: number) => ActionA;

export type ActionCreatorB = (p1: number) => ActionB;

export const actionCreatorA: ActionCreatorA = (p1, p2) => ({
  type: 'EXAMPLE_A',
  payload: {
    p1,
    p2,
  },
});

export const actionCreatorB: ActionCreatorB = (p1) => ({
  type: 'EXAMPLE_B',
  payload: {
    p1,
  },
});
