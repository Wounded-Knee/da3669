# DA3669: D³ Prototype

<img src="https://github.com/WAKlNYAN/da3669/raw/master/assets/d3.gif" width="150">

---

## Development

- Separate `tsconfig.json` for client and server.
- Client and server can share code (And types). For example: [IUserDTO.d.ts](https://github.com/gilamran/fullstack-typescript/blob/master/src/shared/IUserDTO.d.ts)
- The client is bundled using [Webpack](https://webpack.github.io/) because it goes to the browser.
- The server is emitted by [TypeScript](https://github.com/Microsoft/TypeScript) because node now supports es6.

<p align="center">
<img src="https://github.com/gilamran/fullstack-typescript/raw/master/assets/images/flow.png" width="500">
</p>

---

## Requirements

- `NodeJs 16.13.1+`, `Chrome 79+` or `FireFox 72+`

### Directory Layout

```bash
.
├── node_modules/                     # 3rd-party libraries and utilities
├── dist/                             # All the generated files will go here, and will run from this folder
├── src/                              # The source code of the application
│   ├── client/                       # React app
│   ├── server/                       # Express server app
│   └── shared/                       # The shared code between the client and the server
├── assets/                           # images, css, jsons etc.
├── .eslintrc                         # es-lint configuration
├── .prettierec                       # prettier configuration
├── .gitignore                        # ignored git files and folders
├── .nvmrc                            # Force nodejs version
├── .env                              # (ignored) Can be used to override environment variables
├── index.js                          # The server's entry point
├── package.json                      # The list of 3rd party libraries and utilities
├── tsconfig-for-webpack-config.json  # using TypeScript for the webpack config file
└── README.md                         # This file
```

### Client
- [React v17](https://facebook.github.io/react/)
- [React router v6](https://reactrouter.com/)
- [MUI](https://mui.com/)
- [Emotion](https://emotion.sh/docs/styled)
- [Jest](https://jestjs.io/)

### Server
- [Express](https://expressjs.com/)
- [µWebSockets](https://github.com/uNetworking/uWebSockets)
- [MongoDB](https://www.mongodb.com/) / [Mongoose](https://mongoosejs.com/)
- [Passport](https://www.passportjs.org/)

### Usage

- `npm run dev` - Client and server are in watch mode with source maps, opens [http://localhost:3000](http://localhost:3000)
- `npm run test` - Runs jest tests
- `npm run lint` - Runs es-lint
- `npm run build` - `dist` folder will include all the needed files, both client (Bundle) and server.
- `npm start` - Just runs `node ./dist/server/server.js`
- `npm start:prod` - sets `NODE_ENV` to `production` and then runs `node ./dist/server/server.js`. (Bypassing webpack proxy)

### Configuration

.env
```
MONGODB_URL=mongodb+srv://mongoDBUsername:m0n60dbp455w0rd@mongoDBHost/mongoDBDatabase?retryWrites=true&w=majority
AUTH_GOOGLE_CLIENT_ID=6006l304u7h2cl13n71d.apps.googleusercontent.com
AUTH_GOOGLE_CLIENT_SECRET=6006l304u7h2cl13n753cr37
```

---

#### Licence

No license is offered to the general public. This code is private property.

Copyright © ɐʞoʎǝH - All Rights Reserved.
Unauthorized copying of data in this project, via any medium, is strictly prohibited.
Proprietary and confidential.
Written by ɐʞoʎǝH <*@heyoka.us>, November 2021.
