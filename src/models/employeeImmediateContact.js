"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployeeImmediateContact extends Model {
    static associate(models) {}
  }
  EmployeeImmediateContact.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: true },
      relation: { type: DataTypes.STRING, allowNull: false },
      employee_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "EmployeeImmediateContact",
    }
  );
  return EmployeeImmediateContact;
};
