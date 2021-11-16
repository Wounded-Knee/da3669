import { ICoreConfig as ISharedCoreConfig } from '../shared/all';

interface ICoreConfig extends ISharedCoreConfig {
  date: {
    serverLoad: Date;
  };
}
