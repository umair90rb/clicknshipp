"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class StockLevel extends Model {
    static associate(models) {}
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
