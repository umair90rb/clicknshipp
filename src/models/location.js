'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {}
  }

  Location.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Location',
      timestamps: true,
    }
  );

  return Location;
};
