import mongoose from 'mongoose';
import HTTPServer from './lib/classes/HttpServer';
import { HTTP_SERVER_PORT } from './config';
import './lib/models';

const mongoDB = {
  url: process.env.MONGODB_URL,
  sslCert: process.env.MONGODB_CERT,
};

const mongoosePromise = mongoose
  .connect(mongoDB.url)
  .then(() => {
    console.log('MongoDB Connected.');
  })
  .catch((err) => {
    if (err.toString().indexOf('certificate validation failed') !== -1) {
      console.error('MongoDB Certificate Validation Failed');
    } else {
      console.error(err);
    }
  });

const httpServer = new HTTPServer({
  port: HTTP_SERVER_PORT,
});

Promise.all([mongoosePromise, httpServer.initialize()]).then(() => {
  console.log('Ready');
});
