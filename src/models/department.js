"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasOne(models.Employee, {
        as: "employee",
        foreignKey: "department_id",
      });
    }
  }
  Department.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Department",
      timestamps: false,
    }
  );
  return Department;
};
