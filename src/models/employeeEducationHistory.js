"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class EmployeeEducationHistory extends Model {
    static associate(models) {}
  }
  EmployeeEducationHistory.init(
    {
      degree: { type: DataTypes.STRING, allowNull: false },
      started_at: { type: DataTypes.STRING, allowNull: false },
      ended_at: { type: DataTypes.STRING, allowNull: false },
      obtained: { type: DataTypes.FLOAT, allowNull: false },
      total: { type: DataTypes.FLOAT, allowNull: false },
      employee_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "EmployeeEducationHistory",
      underscored: true,
    }
  );
  return EmployeeEducationHistory;
};
