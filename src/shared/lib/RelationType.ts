import { INodeBase, INodeAll } from '../all';

type RelationTypeSelector = string;
type RelationTypeSingular = RelationTypeSelector;
type RelationTypePlural = RelationTypeSelector;
type RelationTypeTuple = [RelationTypeSingular, RelationTypePlural];
type RelationTypeGroup = [RelationTypeTuple, RelationTypeTuple];

interface IRelationTypeSelectorSet {
  singular: RelationTypeSingular;
  plural: RelationTypePlural;
}

// Hardcoded and horrible
export const relationTypes = <RelationTypeGroup[]>[
  [
    ['upstream', 'upstreams'],
    ['downstream', 'downstreams'],
  ],
  [
    ['child', 'children'],
    ['parent', 'parents'],
  ],
  [
    ['author', 'authors'],
    ['work', 'works'],
  ],
];

export class RelationType {
  group = [];
  currentSelector = '';
  lit = [0, 1];
  vir = [2, 3];
  sin = [0, 2];
  plu = [1, 3];

  constructor(selector: RelationTypeSelector = undefined) {
    this.selector = selector;
  }

  set selector(relationTypeName: RelationTypeSelector) {
    this.currentSelector = relationTypeName;
  }

  get selector(): RelationTypeSelector {
    return this.currentSelector;
  }

  get isLiteral(): boolean {
    return this.lit.includes(this.getCursorPosition());
  }

  get isVirtual(): boolean {
    return this.vir.includes(this.getCursorPosition());
  }

  get isSingular(): boolean {
    return this.sin.includes(this.getCursorPosition());
  }

  get isPlural(): boolean {
    return this.plu.includes(this.getCursorPosition());
  }

  get converse(): IRelationTypeSelectorSet {
    return this.isVirtual ? this.literal : this.virtual;
  }

  get virtual(): IRelationTypeSelectorSet {
    const tupleIndex = 1;
    return {
      singular: this.getGroup()[tupleIndex][0],
      plural: this.getGroup()[tupleIndex][1],
    };
  }

  get literal(): IRelationTypeSelectorSet {
    const tupleIndex = 0;
    return {
      singular: this.getGroup()[tupleIndex][0],
      plural: this.getGroup()[tupleIndex][1],
    };
  }

  getCursorPosition(selector: RelationTypeSelector = this.currentSelector, group = this.getGroup()): number {
    // @ts-ignore
    return group.flat(1).indexOf(selector);
  }

  getGroup(selector: RelationTypeSelector = this.currentSelector): RelationTypeGroup {
    const group = relationTypes.find((group) => group.find((tuple) => tuple.includes(selector)));
    return group.length && group;
  }
}
