"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.belongsTo(models.Customer);
    }
  }
  Address.init(
    {
      address1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zip: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      country_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      province_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      sequelize,
      modelName: "Address",
      tableName: "Addresses",
      underscored: true,
    }
  );

  return Address;
};
