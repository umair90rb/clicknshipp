"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class EmployeeAllowance extends Model {
    static associate(models) {
      EmployeeAllowance.hasOne(models.Allowance, {
        as: "allowance",
        foreignKey: "allowance_id",
      });
    }
  }
  EmployeeAllowance.init(
    {
      allowance_id: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      employee_id: { type: DataTypes.INTEGER, allowNull: false },
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
