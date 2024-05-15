"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Delivery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Delivery.belongsTo(models.Order, {
        as: "delivery",
        foreignKey: "order_id",
      });
      Delivery.belongsTo(models.DeliveryServiceAccounts, {
        as: "account",
        foreignKey: "account_id",
      });
    }
  }
  Delivery.init(
    {
      courier: DataTypes.STRING,
      cn: DataTypes.STRING,
      slip_link: DataTypes.STRING,
      status: DataTypes.STRING,
      order_id: {
        type: DataTypes.INTEGER,
      },
      account_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Delivery",
    }
  );
  return Delivery;
};
