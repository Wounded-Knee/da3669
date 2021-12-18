import { INodeAll } from '../../../shared/nodes/all';
import { NodeSelector } from './NodeSelector';

test('Can match downstreams', () => {
  const selector = new NodeSelector('xyzzy').andRelations('downstreams');
  const candidate = <INodeAll>{
    _id: 'plugh',
    text: 'Nothing',
    author: 'ɐʞoʎǝH',
    rel: {
      upstreams: ['xyzzy'],
    },
  };
  // @ts-ignore
  expect(selector.filterMatchingNodes([candidate]).length).toBe(1);
});

test('Can match top-level nodes', () => {
  const selector = new NodeSelector('xyzzy').withoutRelations('upstreams');
  const candidate = <INodeAll>{
    _id: 'plugh',
    text: 'Nothing',
    author: 'ɐʞoʎǝH',
    rel: {},
  };
  // @ts-ignore
  expect(selector.filterMatchingNodes([candidate]).length).toBe(1);
});
