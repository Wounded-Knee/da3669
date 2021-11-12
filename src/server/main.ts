import HTTPServer from './httpServer';
//import { store as entityStore } from '../shared/wireframes/entities';
import { actions } from './lib/ReduxStore';
import { Entity, Text, Classification, Avatar } from '../shared/lib/Entities';
import { wsServer } from './wsServer';
// @ts-ignore
const { newEntity } = actions;

const httpServer = new HTTPServer();

Promise.all([
  httpServer.initialize().then(() => {
    console.log('HTTP Server Running');
  }),

  wsServer.initialize().then(() => {
    console.log('WS Server Running');
  }),
]).then(() => {
  console.log('Ready');
  newEntity(Entity('Blah'));
});
