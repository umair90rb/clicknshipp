"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class OrderHistory extends Model {
    static associate(models) {
      OrderHistory.belongsTo(models.User, {
        as: "user",
        foreignKey: "user_id",
      });
      OrderHistory.belongsTo(models.Order, {
        as: "order",
        foreignKey: "order_id",
      });
    }
  }
  OrderHistory.init(
    {
      order_id: DataTypes.NUMBER,
      user_id: DataTypes.NUMBER,
      event: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "OrderHistory",
    }
  );
  return OrderHistory;
};
