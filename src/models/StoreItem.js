"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class StoreItem extends Model {
    static associate(models) {}
  }
  StoreItem.init(
    {
      data: DataTypes.STRING,
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "StoreItems",
    }
  );
  return StoreItem;
};
