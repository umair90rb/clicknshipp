"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.belongsToMany(models.Permission, {
        through: "RolePermissions",
        as: "permissions",
        foreignKey: "role_id",
      });
    }
  }
  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Role already exist!",
        },
      },
    },
    {
      sequelize,
      modelName: "Role",
      timestamps: false,
    }
  );
  return Role;
};
