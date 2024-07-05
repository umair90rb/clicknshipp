"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeIncrementHistory extends Model {
    static associate(models) {}
  }
  EmployeeIncrementHistory.init(
    {
      type: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      employee_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "EmployeeIncrementHistory",
      tableName: "EmployeeIncrementHistories",
      underscored: true,
    }
  );
  return EmployeeIncrementHistory;
};
