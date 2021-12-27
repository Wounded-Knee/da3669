import { server, client } from '../../../../shared/lib/redux/actionTypes';
import { getModelByName } from '../../nodes/all';
import { Types } from 'mongoose';
import { INodeAll } from '../../../../shared/all';

const debug = {
  [server.CREATE]: true,
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
