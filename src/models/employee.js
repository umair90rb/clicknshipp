"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.hasMany(models.EmployeeAllowance, {
        as: "allowances",
        foreignKey: "employee_id",
      });
      Employee.hasMany(models.EmployeeEducationHistory, {
        as: "education",
        foreignKey: "employee_id",
      });
      Employee.hasMany(models.EmployeeExperience, {
        as: "experiences",
        foreignKey: "employee_id",
      });
      Employee.hasMany(models.EmployeeImmediateContact, {
        as: "contacts",
        foreignKey: "employee_id",
      });
      Employee.hasMany(models.EmployeeIncrementHistory, {
        as: "increments",
        foreignKey: "employee_id",
      });
      Employee.hasOne(models.Designation, {
        as: "designation",
        foreignKey: "designation_id",
      });
      Employee.hasOne(models.Department, {
        as: "department",
        foreignKey: "department_id",
      });
    }
  }
  Employee.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      hire_at: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      department_id: { type: DataTypes.INTEGER, allowNull: true },
      designation_id: { type: DataTypes.INTEGER, allowNull: true },
      salary: { type: DataTypes.FLOAT, allowNull: true },
      ex: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Employee",
      tableName: "Employees",
      underscored: true,
    }
  );
  return Employee;
};
