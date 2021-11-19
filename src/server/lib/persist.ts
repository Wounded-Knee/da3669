import { STORE_DB_FILE } from '../config';
import fs from 'fs';

export const save = (data) => {
  fs.writeFile(STORE_DB_FILE, JSON.stringify(data), (err) => {
    if (err) return console.log(err);
    console.log('Data Persisted');
  });
};

export const load = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(STORE_DB_FILE, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
};
