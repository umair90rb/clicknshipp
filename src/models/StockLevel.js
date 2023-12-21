"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class StockLevel extends Model {
    static associate(models) {
      StockLevel.belongsTo(models.Item, {
        as: "item",
        foreignKey: "item_id",
      });
      StockLevel.hasMany(models.StockHistory, {
        as: "history",
        foreignKey: "stock_id",
      });
    }
  }
  StockLevel.init(
    {
      level: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    },
    {
      sequelize,
      modelName: "StockLevel",
      timestamps: true,
    }
  );
  return StockLevel;
};
