import { Types } from 'mongoose';
import { server, client } from '../../../../shared/lib/redux/actionTypes';
import { defaultModel, getModelByName } from '../../nodes/all';
import { INodeAll } from '../../../../shared/all';
import { getQueryByProfile } from '../../../../shared/lib/selectorQueries';

const debug = {
  [server.CREATE]: true,
};

export const actionSelectNodes = async (context, next) => {
  if (context.session) {
    const {
      session: { userId },
      message: {
        decoded: {
          action: { type, payload },
        },
      },
    } = context;

    if (type === server.SUBSCRIBE) {
      if (userId) {
        const query = getQueryByProfile(payload);
        if (query) {
          const nodes = await defaultModel.find();
          context.nodes.retrieved = [...context.nodes.retrieved, ...nodes];
          context.actions.push({
            type: client.STASH,
            payload: nodes,
          });
        } else {
          context.actions.push({
            type: client.ERROR,
            payload: 'Invalid selector profile.',
          });
        }
      }
    }
  }
  await next();
};

export const actionCreateNode = async (context, next) => {
  if (context.session) {
    const {
      session: { userId },
      message: {
        decoded: {
          action: { type, payload },
        },
      },
    } = context;

    if (type === server.CREATE) {
      if (userId) {
        await Promise.all(
          payload.map((receivedNodeData): INodeAll => {
            const Model = getModelByName(receivedNodeData.kind);
            const nodeData = {
              ...receivedNodeData,
              rel: Object.keys(receivedNodeData.rel).reduce((rel, relName) => {
                return { ...rel, [relName]: receivedNodeData.rel[relName].map((_id) => new Types.ObjectId(_id)) };
              }, {}),
              author: userId,
            };
            if (debug[server.CREATE]) console.log('Create -> DB ', nodeData);
            return new Model(nodeData).save();
          }),
          //@ts-ignore
        ).then(async (nodes: INodeAll[]): Promise<void> => {
          if (debug[server.CREATE]) console.log('Create <- DB ', nodes);
          context.nodes.created = [...context.nodes.created, ...nodes];
          context.actions.push({
            type: client.STASH,
            payload: await nodes,
          });
        });
      }
    }
  }
  await next();
};
