"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class EmployeeAllowance extends Model {
    static associate(models) {}
  }
  EmployeeAllowance.init(
    {
      type: { type: DataTypes.TEXT, allowNull: true },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      employee_id: { type: DataTypes.INTEGER, allowNull: false },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "EmployeeAllowance",
      tableName: "EmployeeAllowances",
      underscored: true,
    }
  );
  return EmployeeAllowance;
};
