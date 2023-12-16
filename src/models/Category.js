"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Item);
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Category",
      timestamps: true,
      scopes: {
        clean: {
          attributes: {
            exclude: ["updatedAt", "createdAt"],
          },
        },
      },
    }
  );
  return Category;
};
