import mongoose from 'mongoose';
import { webServer } from './lib/classes/webServer';
import { socketServer } from './lib/classes/socketServer';

Promise.all([
  webServer,
  socketServer,
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log('MongoDB Connected.');
    })
    .catch((err) => {
      if (err.toString().indexOf('certificate validation failed') !== -1) {
        console.error('MongoDB Certificate Validation Failed');
      } else {
        console.error(err);
      }
    }),
]).then(() => {
  console.log('******************** Ready ***********************');
});
