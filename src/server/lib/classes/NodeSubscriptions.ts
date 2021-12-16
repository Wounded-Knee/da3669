import { INodeSelectorSerialized } from '../../../shared/all';
import { subscriptionTimeoutMs } from '../../config';
import { selectNodes } from './NodeSelector';

interface ISubscription {
  selector: INodeSelectorSerialized;
  userId: string;
  date: Date;
}

type SubscriptionArray = ISubscription[];

const debug = {
  subscriptionReport: true,
  subscriptions: true,
};
let subscriptions: SubscriptionArray = [];

// In: nodeList array of nodes which have been created or changed
// Out: broadcastPlan
/*
  [
    {
      nodes: nodeArray,
      user: userId,
    }
  ]
*/
export const getBroadcastPlan = (nodeList) =>
  subscriptions.reduce((broadcastPlan, { userId, selector }) => {
    const NodeSelector = selectNodes(selector);
    const nodesToBroadcast = NodeSelector.filterMatchingNodes(nodeList);
    if (nodesToBroadcast.length) {
      return [
        ...broadcastPlan,
        {
          nodes: nodesToBroadcast,
          userId,
        },
      ];
    } else {
      return broadcastPlan;
    }
  }, []);

export const subscribeTo = (NodeSelector, userId) =>
  new Promise((resolve, reject) => {
    let expired = 0,
      refreshed = 0;
    const filteredSubscriptions = subscriptions.filter(({ date, userId: thisUserId, selector }) => {
      const subscriptionDate = new Date(date);
      const subscriptionDeadline = new Date(Date.now() + subscriptionTimeoutMs);
      const isStale = subscriptionDate > subscriptionDeadline;
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

    subscriptions = <SubscriptionArray>[
      // Unsubscribe this user from expired subscriptions
      ...filteredSubscriptions,
      // Subscribe this user to each node
      { selector: NodeSelector.serialize, userId, date: Date.now() },
    ];

    if (debug.subscriptionReport) console.log('Subscription Report: ', report);
    if (debug.subscriptions) {
      console.log('Subscriptions: ');
      console.dir(subscriptions, { depth: null });
    }

    resolve([report]);
  });
