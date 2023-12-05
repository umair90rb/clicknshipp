"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserPermission extends Model {
    static associate(models) {
      models.Permission.belongsToMany(models.User, {
        through: UserPermission,
        as: "users",
        foreignKey: "permission_id",
        onDelete: "SET NULL",
      });
      models.User.belongsToMany(models.Permission, {
        through: UserPermission,
        as: "permissions",
        foreignKey: "user_id",
        onDelete: "SET NULL",
      });
    }
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
