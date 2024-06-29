"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class EmployeeAllowance extends Model {
    static associate(models) {}
  }
  EmployeeAllowance.init(
    {
      type: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      employee_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "EmployeeAllowance",
      underscored: true,
    }
  );
  return EmployeeAllowance;
};
