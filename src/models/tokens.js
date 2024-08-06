"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Tokens extends Model {
    static associate(models) {
      Tokens.belongsTo(models.DeliveryServiceAccounts, {
        foreignKey: "account_id",
        as: "account",
      });
    }
  }
  Tokens.init(
    {
      account_id: DataTypes.INTEGER,
      token: DataTypes.TEXT,
      type: DataTypes.STRING,
      expiry: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Tokens",
    }
  );
  return Tokens;
};
