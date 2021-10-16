import dotenv from 'dotenv';
import findUp from 'find-up';
import path from 'path';
import fs from 'fs';
import { WS_SERVER_PORT, WS_SERVER_HOST } from '../shared/config';

const IS_DEV = process.env.NODE_ENV !== 'production';

if (IS_DEV) {
  dotenv.config({ path: findUp.sync('.env') });
}

const packageJsonPath = path.join(process.cwd(), 'package.json');
const rawPackageJson = fs.readFileSync(packageJsonPath).toString();
const PackageJson = JSON.parse(rawPackageJson);
const { version: VERSION } = PackageJson;

// HTTP Server
const SERVER_PORT = process.env.PORT || 3000;
const WEBPACK_PORT = 8085; // For dev environment only

// WS Server
const STORE_DB_FILE = './db.json';

export { IS_DEV, VERSION, SERVER_PORT, WEBPACK_PORT, WS_SERVER_HOST, WS_SERVER_PORT, STORE_DB_FILE };
