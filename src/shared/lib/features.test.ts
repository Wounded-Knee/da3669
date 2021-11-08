import { FEATURES } from '../config';
import { features } from './features';

test('Correct stuff is exported', () => {
  expect(features).toBeDefined();
});

describe('getFeature()', () => {
  test('Extant matching features are returned', () => {
    expect(features.getFeature(FEATURES[0])).toBeDefined;
  });
  test('Futile searches return undefined', () => {
    expect(features.getFeature('Nonexistent Feature')).toBeUndefined;
  });
});

describe('getFeatureByRPC()', () => {
  test('it works', () => {
    console.log('xyzzy');
    expect(features.getFeatureByRPC('getEntityById')).toBe('x');
    expect(features.getFeatureByRPC('Nonexistent Feature')).toBeUndefined;
  });
});
