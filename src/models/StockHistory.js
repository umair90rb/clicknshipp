"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class StockHistory extends Model {
    static associate(models) {
      StockHistory.belongsTo(models.Item, {
        foreignKey: "item_id",
        as: "item",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      StockHistory.belongsTo(models.StockLevel, {
        foreignKey: "stock_id",
        as: "stock",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }
  StockHistory.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expiry: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "StockHistory",
      timestamps: true,
    }
  );
  return StockHistory;
};
