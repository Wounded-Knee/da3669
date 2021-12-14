import { getNetWorthByUserId } from './getNetWorthByUserId';
import { server, client } from '../../../shared/lib/redux/actionTypes';
import { getNodeTypeByName, defaultNodeType } from '../../../shared/nodes/all';
import { subscribeTo } from './NodeSubscriptions';
const { model: DefaultModel } = defaultNodeType;
const debug = {
  errors: true,
  messages: true,
};

export const processAction = async ({ honorRequest, type, payload, userId, respondWith, promiseId }) => {
  if (debug.messages) console.log('MSG ', { type, payload, promiseId });
  if (!honorRequest) {
    respondWith({ type: client.SESSION_EXPIRED });
    return false;
  }
  try {
    switch (type) {
      case server.ECONOMY_TRANSFER:
        const { model: EconomyModel } = getNodeTypeByName('Economy');
        const { qty, destinationId } = payload;
        new EconomyModel({
          qty,
          destinationId,
          author: userId,
        })
          .save()
          .then(async (transaction) => {
            respondWith({
              type: client.UPDATE_NET_WORTH,
              payload: await getNetWorthByUserId(userId),
            });
          });
        break;

      case server.GET_USER:
        const netWorth = await getNetWorthByUserId(userId);
        respondWith({
          type: client.ABSORB_NODES,
          payload: await DefaultModel.findById(userId),
        });
        respondWith({
          type: client.UPDATE_NET_WORTH,
          payload: netWorth,
        });
        break;

      case server.SUBSCRIBE_BY_SELECTOR:
        let selectedNodes;
        if (typeof payload === 'string') {
          const selector = {
            TOP_LEVEL: {
              rel: {
                upstreams: [],
              },
            },
          }[payload];
          selectedNodes = await DefaultModel.find(selector);
        } else {
          // Process selector object
          selectedNodes = [];
        }

        subscribeTo(selectedNodes, userId).then(() => {
          respondWith({
            type: client.ABSORB_NODES,
            payload: selectedNodes,
          });
        });
        break;

      case server.SUBSCRIBE:
        const nodeIdArray = payload;
        // Retrieve each subscribed node and its downstreams
        const nodesOfInterest = await DefaultModel.find({
          $or: [{ _id: { $in: nodeIdArray } }, { rel: { upstreams: { $in: nodeIdArray } } }],
        });

        subscribeTo(nodesOfInterest, userId).then(() => {
          //Return each node
          respondWith({
            type: client.ABSORB_NODES,
            payload: nodesOfInterest,
          });
        });
        break;

      case server.ABSORB_NODES:
        Promise.all(
          payload.map((nodeData) =>
            new DefaultModel({
              ...nodeData,
              author: userId,
            }).save(),
          ),
        ).then((newNodes) => {
          respondWith({
            type: client.ABSORB_NODES,
            payload: newNodes,
          });
        });
        break;

      default:
        console.log('Un-handled message type: ', type, payload);
        respondWith({
          type: client.NOOP,
        });
        break;
    }
  } catch (e) {
    if (debug.errors) console.error(e);
    respondWith({
      type: client.ERROR,
      payload: {
        message: e.message,
        action: { type, payload },
      },
    });
  }
};
