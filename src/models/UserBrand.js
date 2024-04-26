"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserBrand extends Model {
    static associate(models) {
      models.Brand.belongsToMany(models.User, {
        through: UserBrand,
        as: "users",
        foreignKey: "brand_id",
        onDelete: "CASCADE",
      });
      models.User.belongsToMany(models.Brand, {
        through: UserBrand,
        as: "brands",
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
    }
  }
  UserBrand.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserBrand",
      timestamps: false,
    }
  );
  return UserBrand;
};
