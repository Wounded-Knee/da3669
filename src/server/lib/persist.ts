import { STORE_DB_FILE } from '../config';
import fs from 'fs';

export const save = (data) => {
  fs.writeFile(STORE_DB_FILE, JSON.stringify(data), (err) => {
    if (err) return console.log(err);
    console.log(`Data Persisted to ${STORE_DB_FILE}`);
  });
};

export const load = () => JSON.parse(fs.readFileSync(STORE_DB_FILE).toString());
