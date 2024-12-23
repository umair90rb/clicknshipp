'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Chanel extends Model {
    static associate(models) {
      Chanel.belongsTo(models.Brand, {
        as: 'brand',
        foreignKey: 'brand_id',
      });
    }
  }
  Chanel.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Unknown',
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Chanel',
      scopes: {
        clean: {
          attributes: {
            include: ['id', 'name', 'source'],
          },
        },
      },
    }
  );
  return Chanel;
};
