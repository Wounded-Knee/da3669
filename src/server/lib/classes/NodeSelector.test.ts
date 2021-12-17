import { INodeAll } from '../../../shared/nodes/all';
import { NodeSelector } from './NodeSelector';

test('um', () => {
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
