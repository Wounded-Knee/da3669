import { getNodeTypeByName } from '../../../shared/nodes/all';

export const getNetWorthByUserId = async (userId) => {
  const { model: EconomyModel } = getNodeTypeByName('Economy');
  const economyNodes = await EconomyModel.find({
    author: userId,
    kind: 'Economy',
  });
  return economyNodes.reduce((netWorth, economyNode) => {
    const { qty } = economyNode;
    return netWorth - qty;
  }, 0);
};
