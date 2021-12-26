import { TextDecoder } from 'util';
const textDecoder = new TextDecoder('utf-8');

export const decoder = async (context, next) => {
  context.message.decoded = JSON.parse(textDecoder.decode(context.message.raw));
  await next();
};
