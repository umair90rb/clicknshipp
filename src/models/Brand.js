"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.hasMany(models.Item, {
        as: "items",
        foreignKey: "brand_id",
      });
      Brand.hasMany(models.Chanel, {
        as: "chanels",
        foreignKey: "brand_id",
      });
    }
  }
  Brand.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Brand",
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
  return Brand;
};
