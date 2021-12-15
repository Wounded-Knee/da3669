import { subscriptionTimeoutMs } from '../../config';

const debug = {
  subscriptionReport: true,
  subscriptions: true,
};
let subscriptions = [];

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

export const subscribeTo = (NodeSelector, userId) =>
  new Promise((resolve, reject) => {
    let expired = 0,
      refreshed = 0;
    const filteredSubscriptions = subscriptions.filter(({ date, userId: thisUserId, selector }) => {
      const keepSubscription = true;
      const subscriptionDate = new Date(date);
      const subscriptionDeadline = new Date(Date.now() + subscriptionTimeoutMs);
      const isStale = subscriptionDate > subscriptionDeadline;
      console.log('Stale: ', subscriptionDate, '>', subscriptionDeadline);
      const userMatched = thisUserId === userId;
      const selectorMatched = NodeSelector.equals(selector);
      const freshen = userMatched && selectorMatched;
      const removeSubscription = isStale || freshen;
      expired = isStale ? expired + 1 : expired;
      refreshed = freshen ? refreshed + 1 : refreshed;

      // Remove because...
      // 1) We are about to add a fresher subscription to the same node for the same user
      // 2) This subscription is outright stale.
      return !removeSubscription;
    });

    const report = {
      nBefore: subscriptions.length,
      nExpired: expired,
      nFreshened: refreshed,
      nRemoved: subscriptions.length - filteredSubscriptions.length,
    };

    subscriptions = [
      // Unsubscribe this user from expired subscriptions
      ...filteredSubscriptions,
      // Subscribe this user to each node
      { selector: NodeSelector.serialize, userId, date: Date.now() },
    ];

    if (debug.subscriptionReport) console.log('Subscription Report: ', report);
    if (debug.subscriptions) console.log('Subscriptions: ', subscriptions);

    resolve([report]);
  });
