'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class UnitOfMeasure extends Model {
    static associate(models) {}
  }

  UnitOfMeasure.init(
    {
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UnitOfMeasure',
      timestamps: true,
    }
  );

  return UnitOfMeasure;
};
