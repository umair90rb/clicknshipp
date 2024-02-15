"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class CityNameMaping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CityNameMaping.init(
    {
      city: { type: DataTypes.STRING, allowNull: false },
      maped: { type: DataTypes.STRING, allowNull: false },
      courier: { type: DataTypes.STRING, allowNull: false },
      assigned_id: {
        type: DataTypes.STRING,
      },
      active_as_origin: {
        type: DataTypes.BOOLEAN,
      },
      active_as_destination: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "CityNameMaping",
    }
  );
  return CityNameMaping;
};
