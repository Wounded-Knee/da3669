import mongoose from 'mongoose';
import Server from './lib/classes/D3Server';
import { HTTP_SERVER_PORT, WS_SERVER_PORT } from './config';

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

const server = new Server({
  httpPort: HTTP_SERVER_PORT,
  wsPort: WS_SERVER_PORT,
});

Promise.all([mongoosePromise, server.initialize()]).then(() => {
  console.log('Ready');
});
