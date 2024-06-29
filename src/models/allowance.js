"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Allowance extends Model {
    static associate(models) {}
  }
  Allowance.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Allowance",
      timestamps: false,
    }
  );
  return Allowance;
};
