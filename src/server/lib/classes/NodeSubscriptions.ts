import { INodeSelectorSerialized, UserId } from '../../../shared/all';
import { subscriptionTimeoutMs } from '../../config';
import { NodeSelector, selectNodes } from './NodeSelector';
import { INodeAll } from '../../../../dist/shared/nodes/all';

const debug = {
  subscriptionReport: true,
  subscriptions: true,
};

interface ISubscription {
  selector: INodeSelectorSerialized;
  userId: string;
  date: Date;
}

interface IBroadcastPlanItem {
  nodes: INodeAll[];
  userId: UserId;
}
type BroadcastPlan = IBroadcastPlanItem[];

type SubscriptionArray = ISubscription[];

let subscriptions: SubscriptionArray = [];

export const getBroadcastPlan = (nodeList: INodeAll[]): BroadcastPlan =>
  subscriptions.reduce((broadcastPlan, { userId, selector }) => {
    const NodeSelector = selectNodes(selector);
    const nodesToBroadcast = NodeSelector.filterMatchingNodes(nodeList);
    if (nodesToBroadcast.length) {
      return <BroadcastPlan>[
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

export const subscribeTo = (NodeSelector: NodeSelector, userId: UserId): Promise<any> =>
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
