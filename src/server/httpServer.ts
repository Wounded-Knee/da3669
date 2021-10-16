import express from 'express';
import path from 'path';
import { apiRouter } from './routes/api-router';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';
import Server from './lib/Server';
import * as config from './config';

class HTTPServer extends Server {
  constructor() {
    super();
    console.log(`*******************************************`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`config: ${JSON.stringify(config, null, 2)}`);
    console.log(`*******************************************`);

    this.whileInitializing(
      new Promise((resolve) => {
        const httpServer = express();
        this.express = httpServer;
        httpServer.set('view engine', 'ejs');

        httpServer.use('/assets', express.static(path.join(process.cwd(), 'assets')));
        httpServer.use(apiRouter());
        httpServer.use(staticsRouter());
        httpServer.use(pagesRouter());

        httpServer.listen(config.SERVER_PORT, () => {
          resolve(void 0);
        });
      }),
    );
  }

  initialize() {
    this.log('init');
    return super.initialize();
  }
}

export default HTTPServer;
