import Express from 'express';
import path from 'path';
import { pagesRouter } from '../../routes/pages-router';
import { staticsRouter } from '../../routes/statics-router';
import { setupPassport } from '../../authentication';
import session from 'express-session';
import { HTTP_SERVER_PORT } from '../../config';

export const webServer = new Promise((resolve) => {
  const express = Express();
  express.set('view engine', 'ejs');
  express.use(session({ resave: true, saveUninitialized: true, secret: 'Laura Ingalls Wilder' }));

  // Passport Authentication
  setupPassport(express);

  // React
  express.use('/assets', Express.static(path.join(process.cwd(), 'assets')));
  express.use(staticsRouter());
  express.use(pagesRouter());

  const httpServer = express.listen(HTTP_SERVER_PORT, () => {
    console.log(`HTTP Listening @ port ${HTTP_SERVER_PORT}`);
    resolve([express, httpServer]);
  });
});
