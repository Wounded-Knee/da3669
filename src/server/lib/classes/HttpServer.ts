import express from 'express';
import path from 'path';
import { apiRouter } from '../../routes/api-router';
import { pagesRouter } from '../../routes/pages-router';
import { staticsRouter } from '../../routes/statics-router';
import Server from './Server';

class HTTPServer extends Server {
  express;

  constructor({ port }: { port: number }) {
    super();

    this.whileInitializing(
      new Promise((resolve) => {
        const httpServer = express();
        this.express = httpServer;
        httpServer.set('view engine', 'ejs');

        httpServer.use('/assets', express.static(path.join(process.cwd(), 'assets')));
        httpServer.use(apiRouter());
        httpServer.use(staticsRouter());
        httpServer.use(pagesRouter());

        httpServer.listen(port, () => {
          this.log(`Listening on port ${port}`);
          resolve(void 0);
        });
      }),
    );
  }

  initialize(): Promise<any[]> {
    this.log('Initializing...');
    return super.initialize();
  }
}
Object.assign(HTTPServer.prototype, {
  _className: 'HTTPServer',
  _showDebug: true,
});

export default HTTPServer;
