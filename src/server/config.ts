import dotenv from 'dotenv';
import findUp from 'find-up';
import path from 'path';
import fs from 'fs';
import { WS_SERVER_PORT, WS_SERVER_HOST, HTTP_SERVER_PORT as _HTTP_SERVER_PORT } from '../shared/config';

const IS_DEV = process.env.NODE_ENV !== 'production';

if (IS_DEV) {
  dotenv.config({ path: findUp.sync('.env') });
}

const packageJsonPath = path.join(process.cwd(), 'package.json');
const rawPackageJson = fs.readFileSync(packageJsonPath).toString();
const PackageJson = JSON.parse(rawPackageJson);
const { version: VERSION } = PackageJson;

// HTTP Server
const HTTP_SERVER_PORT = parseInt(process.env.PORT) || _HTTP_SERVER_PORT;
const WEBPACK_PORT = 8085; // For dev environment only

export { IS_DEV, VERSION, WEBPACK_PORT, HTTP_SERVER_PORT, WS_SERVER_HOST, WS_SERVER_PORT };
