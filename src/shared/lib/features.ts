import { FEATURES } from '../config';
import { ObjectFilter } from '../utils';

/*
const features = {
  testFeature: {
    testRPC: {
      args: [
        {
          name: 'entityData',
          type: 'json',
          pack: (data) => JSON.parse(data),
          unpack: (data) => JSON.stringify(data),
        },
      ],
      middleware: function () {},
    },
  },
};

Object.prototype.filter = function (callback) {
  return Object.fromEntries(Object.entries(this).filter(([key, val]) => callback(val, key)));
};

const { rpc, server, client, features } = FEATURES.map((featureName) => {
  const featureClass = require(`./features/${featureName}`);
  return {
    feature: new featureClass(),
    name: featureName,
  };
}).reduce(
  (r, { name, rpc, client, server }, index) => ({
    rpc: { ...r.rpc, ...(rpc || {}) },
    server: [...r.server, server],
    client: [...r.client, client],
  }),
  {
    rpc: {},
    server: [],
    client: [],
    features: {},
  },
);

export { rpc, server, client, features };
*/

class FeatureCollection {
  features = {};

  constructor(features) {
    this.features = features;
  }

  getFeature(featureName) {
    return this.filter((key, obj) => key === featureName);
  }

  getFeatureByRPC(rpcName) {
    return this.filter(undefined, (key, obj) => key === rpcName);
  }

  filter(feature?, rpc?, arg?) {
    const doNotFilter = () => true;
    const s1 = ObjectFilter(this.features, feature || doNotFilter);
    const s2 = ObjectFilter(s1, rpc || doNotFilter);
    const s3 = ObjectFilter(s2, arg || doNotFilter);
    console.log(s1, s2, s3);
    return s3;
    /*
    return ObjectFilter(
      ObjectFilter(ObjectFilter(this.features, feature || doNotFilter), rpc || doNotFilter),
      arg || doNotFilter,
    );
    */
  }

  register(featureName, feature) {
    this.features[featureName] = feature;
  }
}

/*
FEATURES = ['f1', 'f2'];
*/
const features = new FeatureCollection(
  FEATURES.reduce((features, featureName) => {
    const feature = require(`./features/${featureName}`);
    return {
      ...features,
      [featureName]: feature,
    };
  }, {}),
);
/*
FEATURES = {
  f1: [Object Feature],
  f2: [Object Feature],
}
*/

export { features };
