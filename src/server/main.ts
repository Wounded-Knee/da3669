import HTTPServer from './lib/classes/HttpServer';
import { Core } from './lib/Core';
import { store } from './lib/redux/store';
import { HTTP_SERVER_PORT, WS_SERVER_HOST as host, WS_SERVER_PORT as port } from './config';
const fs = require('fs');

const mongoDB = {
  url: process.env.MONGODB_URL,
  sslCert: process.env.MONGODB_CERT,
};

const httpServer = new HTTPServer({
  port: HTTP_SERVER_PORT,
});
const core = new Core({
  date: {
    serverLoad: new Date(),
  },
  mongoDB,
  host,
  port,
  store,
});

Promise.all([httpServer.initialize()]).then(() => {
  console.log('Ready');
});
