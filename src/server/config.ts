import dotenv from 'dotenv';
import findUp from 'find-up';
import path from 'path';
import fs from 'fs';
import {
  WEBPACK_PORT,
  relationTypes,
  WS_SERVER_PORT,
  WS_SERVER_HOST,
  HTTP_SERVER_PORT as _HTTP_SERVER_PORT,
} from '../shared/config';

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

// Authentication
export const auth = {
  callbackUrl: `http://${WS_SERVER_HOST}:${HTTP_SERVER_PORT}/google/loginCallback`,
  google: {
    clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
  },
};

export { relationTypes, IS_DEV, VERSION, WEBPACK_PORT, HTTP_SERVER_PORT, WS_SERVER_HOST, WS_SERVER_PORT };
