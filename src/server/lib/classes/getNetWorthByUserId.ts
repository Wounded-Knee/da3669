import { getModelByName } from '../nodes/all';

export const getNetWorthByUserId = async (userId): Promise<number> => {
  const EconomyModel = getModelByName('Economy');
  const economyNodes = await EconomyModel.find({
    author: userId,
    kind: 'Economy',
  });
  return economyNodes.reduce((netWorth, economyNode) => {
    const { qty } = economyNode;
    return netWorth - qty;
  }, 0);
};
