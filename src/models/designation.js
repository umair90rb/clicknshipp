"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Designation extends Model {
    static associate(models) {
      Designation.hasOne(models.Employee, {
        as: "employee",
        foreignKey: "designation_id",
      });
    }
  }
  Designation.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Designation",
      timestamps: false,
    }
  );
  return Designation;
};
