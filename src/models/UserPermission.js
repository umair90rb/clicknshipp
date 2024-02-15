"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserPermission extends Model {
    static associate(models) {}
  }
  UserPermission.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserPermission",
      timestamps: false,
    }
  );
  return UserPermission;
};
