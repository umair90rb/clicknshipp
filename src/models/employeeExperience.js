"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeExperience extends Model {
    static associate(models) {}
  }
  EmployeeExperience.init(
    {
      company: { type: DataTypes.STRING, allowNull: false },
      started_at: { type: DataTypes.STRING, allowNull: false },
      ended_at: { type: DataTypes.STRING, allowNull: false },
      designation: { type: DataTypes.STRING, allowNull: false },
      employee_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "EmployeeExperience",
      tableName: "EmployeeExperiences",
      underscored: true,
    }
  );
  return EmployeeExperience;
};
