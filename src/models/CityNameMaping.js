"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class CityNameMaping extends Model {
    static associate(models) {}
  }
  CityNameMaping.init(
    {
      city: { type: DataTypes.STRING, allowNull: false },
      maped: { type: DataTypes.STRING, allowNull: false },
      courier: { type: DataTypes.STRING, allowNull: false },
      assigned_id: {
        type: DataTypes.STRING,
      },
      active_as_origin: {
        type: DataTypes.BOOLEAN,
      },
      active_as_destination: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "CityNameMaping",
      timestamps: false,
    }
  );
  return CityNameMaping;
};
