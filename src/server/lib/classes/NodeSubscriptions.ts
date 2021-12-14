import { subscriptionTimeoutMs } from '../../config';

/*
Subscriptions:

client
  {
    type: server.SUBSCRIBE,
    payload: [{
      ids: ['a765ba734d73473411'],
      self: true,
      rel: true,
      rel: ['upstream', 'downstream'],
    }]
  }

*/

let subscriptions = [];

const getNodeIdList = (nodeList) => nodeList.map(({ _id }) => _id.toString());

export const broadcastCreatedNodes = (nodeList) => {
  new Promise((resolve, reject) => {
    // For each node
    //    Which users are subscribed to it?
    //      getUsersSubscribedToNodes(nodeList) -> userList
    //
  });
};

// In: nodeIdArray
// Out: SocketRegistryRecordArray
const getSubscribersByNodes = () => {};

export const subscribeTo = (nodeList, userId) =>
  new Promise((resolve, reject) => {
    const nodeIdList = getNodeIdList(nodeList);
    const filteredSubscriptions = subscriptions.filter(({ date, userId: thisUserId, _id }) => {
      const keepSubscription = true;
      const isStale = new Date(date) > new Date(Date.now() - subscriptionTimeoutMs);
      const userMatched = thisUserId === userId;
      const nodeMatched = nodeIdList.indexOf(_id) !== -1;
      const removeSubscription = isStale || (userMatched && nodeMatched);

      // Remove because...
      // 1) We are about to add a fresher subscription to the same node for the same user
      // 2) This subscription is outright stale.
      return !removeSubscription;
    });

    const report = {
      nBefore: subscriptions.length,
      nAdded: nodeIdList.length,
      nRemoved: subscriptions.length - filteredSubscriptions.length,
    };

    subscriptions = [
      // Unsubscribe this user from expired subscriptions
      ...filteredSubscriptions,
      // Subscribe this user to each node
      ...nodeList.map(({ _id }) => ({ _id, userId, date: Date.now() })),
    ];

    console.log('Subscription Report: ', report);

    resolve([report, nodeList]);
  });
