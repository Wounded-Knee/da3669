import Class from './Class';

class Feature extends Class {
  feature;

  constructor(feature) {
    //@ts-ignore
    super(feature);
    this.feature = feature;
  }

  getArgsByMethodName() {}

  getMethodNameByArgName() {}

  getMiddlewareByMethodName() {}

  getClient() {}
}

export default Feature;
